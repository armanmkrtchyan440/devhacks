'use client'

import { FC, useEffect, useRef } from 'react'

export const CameraTab: FC = () => {
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const activeStreamsRef = useRef<MediaStream[]>([])
	const socketRef = useRef<WebSocket | null>(null)
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const intervalRef = useRef<NodeJS.Timeout | null>(null)
	const audioRecorderRef = useRef<MediaRecorder | null>(null)

	useEffect(() => {
		// 1. Open WebSocket connection
		const socket = new WebSocket('ws://69.197.148.164:8765')
		socketRef.current = socket

		socket.onopen = () => {
			console.log('WebSocket connected.')
		}

		socket.onmessage = event => {
			// Handle incoming messages if needed
			console.log(event)
		}

		socket.onerror = error => {
			console.error('WebSocket error:', error)
		}

		socket.onclose = () => {
			console.log('WebSocket closed.')
		}

		// 2. Get camera stream
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

				// 3. Start frame sending loop
				startFrameSending()
			})
			.catch(err => {
				console.error('Error accessing camera:', err)
			})

		navigator.mediaDevices
			.getUserMedia({
				audio: true, // Enable audio
			})
			.then(mediaStream => {
				activeStreamsRef.current.push(mediaStream)
				startAudioStreaming(mediaStream)
			})
			.catch(err => {
				console.error('Error accessing media devices:', err)
			})

		// Cleanup on unmount
		return () => {
			// Stop webcam
			activeStreamsRef.current.forEach(stream =>
				stream.getTracks().forEach(track => track.stop())
			)
			activeStreamsRef.current = []

			// Close WebSocket
			if (socketRef.current) {
				console.log('Closing WebSocket connection.')
				socketRef.current.close()
			}

			// Clear frame sending interval
			if (intervalRef.current) {
				console.log('Clearing frame sending interval.')
				clearInterval(intervalRef.current)
			}

			if (audioRecorderRef.current?.state !== 'inactive') {
				audioRecorderRef?.current?.stop()
			}
		}
	}, [])

	// Frame sending logic
	const startFrameSending = () => {
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

			context.save();
			context.translate(canvas.width, 0);
			context.scale(-1, 1);
			context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
			context.restore();

			const frameData = canvas.toDataURL('image/jpeg')
			const base64Frame = frameData.split(',')[1]

			if (socketRef.current?.readyState === WebSocket.OPEN) {
				socketRef.current.send(
					JSON.stringify({ type: 'video', data: base64Frame })
				)
			}
		}, 100)
	}

	const startAudioStreaming = (stream: MediaStream) => {
		const recorder = new MediaRecorder(stream)
		audioRecorderRef.current = recorder

		recorder.ondataavailable = event => {
			if (event.data && event.data.size > 0) {
				const reader = new FileReader()
				reader.onloadend = () => {
					const base64Audio = (reader.result as string).split(',')[1]

					if (socketRef.current?.readyState === WebSocket.OPEN) {
						socketRef.current.send(
							JSON.stringify({ type: 'audio', data: base64Audio })
						)
					}
				}
				reader.readAsDataURL(event.data)
			}
		}

		recorder.onstart = () => {
			console.log('Audio recording started.')
		}

		recorder.onstop = () => {
			console.log('Audio recording stopped.')
		}

		recorder.start(2000);
	}

	return (
		<div>
			<video
				ref={videoRef}
				autoPlay
				playsInline
				muted
				className='w-full h-full bg-black rounded-lg shadow aspect-video transform scale-x-[-1]'
			/>
		</div>
	)
}
