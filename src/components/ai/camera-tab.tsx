'use client'

import { useSendVideoToAi } from '@/api'
import { useWebSocket } from '@/providers/websocket'
import { CameraOff } from 'lucide-react'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'

export const CameraTab: FC = () => {
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const activeStreamsRef = useRef<MediaStream[]>([])
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const intervalRef = useRef<NodeJS.Timeout | null>(null)
	const audioRecorderRef = useRef<MediaRecorder | null>(null)
	const combinedStreamRef = useRef<MediaStream | null>(null)
	const recordingChunksRef = useRef<Blob[]>([])
	const recordingMediaRecorderRef = useRef<MediaRecorder | null>(null)

	const { sendMessage } = useWebSocket()
	const { mutate: sendVideo } = useSendVideoToAi()
	const [isRecording, setIsRecording] = useState<boolean>(false)

	const startFrameSending = useCallback(() => {
		intervalRef.current = setInterval(() => {
			if (
				!videoRef.current ||
				videoRef.current.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA
			)
				return

			const canvas =
				canvasRef.current ||
				(canvasRef.current = document.createElement('canvas'))

			canvas.width = videoRef.current.videoWidth
			canvas.height = videoRef.current.videoHeight

			const context = canvas.getContext('2d')
			if (!context) return

			context.save()
			context.translate(canvas.width, 0)
			context.scale(-1, 1)
			context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
			context.restore()

			const frameData = canvas.toDataURL('image/jpeg')
			const base64Frame = frameData.split(',')[1]

			sendMessage({ type: 'video', data: base64Frame })
		}, 100)
	}, [sendMessage])

	const startAudioStreaming = useCallback(
		(stream: MediaStream) => {
			const recorder = new MediaRecorder(stream)
			audioRecorderRef.current = recorder

			recorder.ondataavailable = event => {
				if (event.data && event.data.size > 0) {
					const reader = new FileReader()
					reader.onloadend = () => {
						const base64Audio = (reader.result as string).split(',')[1]
						sendMessage({ type: 'audio', data: base64Audio })
					}
					reader.readAsDataURL(event.data)
				}
			}

			recorder.start(2000)
		},
		[sendMessage]
	)

	const handleToggleRecording = useCallback(() => {
		setIsRecording(prev => !prev)
	}, [])

	useEffect(() => {
		if (!isRecording) return

		const startRecording = async () => {
			try {
				const videoStream = await navigator.mediaDevices.getUserMedia({
					video: {
						width: { ideal: 1280 },
						height: { ideal: 720 },
						frameRate: { ideal: 30, max: 60 },
						aspectRatio: { ideal: 16 / 9 },
						facingMode: 'user',
					},
					audio: false,
				})

				const audioStream = await navigator.mediaDevices.getUserMedia({
					audio: true,
				})

				activeStreamsRef.current.push(videoStream, audioStream)

				// Combine audio and video tracks
				const combinedStream = new MediaStream([
					...videoStream.getVideoTracks(),
					...audioStream.getAudioTracks(),
				])
				combinedStreamRef.current = combinedStream

				if (videoRef.current) {
					videoRef.current.srcObject = combinedStream
					videoRef.current.play()
				}

				// Start WebSocket streaming
				startFrameSending()
				startAudioStreaming(audioStream)

				// Start local recording
				const mediaRecorder = new MediaRecorder(combinedStream)
				recordingMediaRecorderRef.current = mediaRecorder
				recordingChunksRef.current = []

				mediaRecorder.ondataavailable = event => {
					if (event.data.size > 0) {
						recordingChunksRef.current.push(event.data)
					}
				}

				/**
				 * Hint: Send request to server
				 */
				mediaRecorder.onstop = () => {
					const blob = new Blob(recordingChunksRef.current, {
						type: 'audio/mp3',
					})

					sendVideo(blob)
				}

				mediaRecorder.start()
			} catch (err) {
				console.error('Error accessing media devices:', err)
			}
		}

		startRecording()

		return () => {
			// Stop media tracks
			activeStreamsRef.current.forEach(stream =>
				stream.getTracks().forEach(track => track.stop())
			)
			activeStreamsRef.current = []

			// Stop frame sending
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}

			// Stop audio streaming
			if (audioRecorderRef.current?.state !== 'inactive') {
				audioRecorderRef?.current?.stop()
			}

			// Stop recording and trigger download
			if (recordingMediaRecorderRef.current?.state === 'recording') {
				recordingMediaRecorderRef.current.stop()
			}
		}
	}, [isRecording, sendVideo, startAudioStreaming, startFrameSending])

	return (
		<div className='h-full flex flex-col'>
			<div className='w-full flex-1 flex items-center justify-center'>
				<div className='relative w-full aspect-video bg-gray-500 rounded-sm overflow-hidden'>
					{!isRecording && (
						<div className='absolute top-0 left-0 w-full h-full bg-gray-500 z-20 flex justify-center items-center'>
							<CameraOff className='w-12 h-12 text-white' />
						</div>
					)}
					<video
						ref={videoRef}
						autoPlay
						playsInline
						muted
						className={
							'w-full h-full rounded-lg shadow aspect-video scale-x-[-1] transform'
						}
					/>
				</div>
			</div>
			<div className='flex justify-center items-center'>
				<Button onClick={handleToggleRecording}>
					{isRecording ? 'Start' : 'Stop'} Recording
				</Button>
			</div>
		</div>
	)
}
