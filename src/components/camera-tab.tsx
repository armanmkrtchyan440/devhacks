'use client'

import { FC, useCallback, useEffect, useRef } from 'react'
import { useWebSocket } from '../hooks/useWebSocket'

interface CameraTabProps {
	isRecording: boolean
}

export const CameraTab: FC<CameraTabProps> = ({ isRecording }) => {
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const activeStreamsRef = useRef<MediaStream[]>([])
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const intervalRef = useRef<NodeJS.Timeout | null>(null)
	const audioRecorderRef = useRef<MediaRecorder | null>(null)

	const { sendMessage } = useWebSocket(
		process.env.WEBSOCKET_URL || '',
		isRecording
	)

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

	useEffect(() => {
		if (!isRecording) return

		// 1. Get camera stream
		navigator.mediaDevices
			.getUserMedia({
				video: {
					width: { ideal: 1280 },
					height: { ideal: 720 },
					frameRate: { ideal: 30, max: 60 },
					aspectRatio: { ideal: 16 / 9 },
					facingMode: 'user',
				},
				audio: false,
			})
			.then(mediaStream => {
				activeStreamsRef.current.push(mediaStream)

				if (videoRef.current) {
					videoRef.current.srcObject = mediaStream
					videoRef.current.play()
				}

				startFrameSending()
			})
			.catch(err => {
				console.error('Error accessing camera:', err)
			})

		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then(mediaStream => {
				activeStreamsRef.current.push(mediaStream)
				startAudioStreaming(mediaStream)
			})
			.catch(err => {
				console.error('Error accessing audio:', err)
			})

		// Cleanup
		return () => {
			activeStreamsRef.current.forEach(stream =>
				stream.getTracks().forEach(track => track.stop())
			)
			activeStreamsRef.current = []

			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}

			if (audioRecorderRef.current?.state !== 'inactive') {
				audioRecorderRef?.current?.stop()
			}
		}
	}, [isRecording, startAudioStreaming, startFrameSending])

	return (
		<div className='w-full'>
			<video
				ref={videoRef}
				autoPlay
				playsInline
				muted
				className='w-full h-full bg-black rounded-lg shadow aspect-video scale-x-[-1] transform'
			/>
		</div>
	)
}
