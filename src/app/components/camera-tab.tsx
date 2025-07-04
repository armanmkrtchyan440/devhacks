'use client'

import { FC, useEffect, useRef } from 'react'

export const CameraTab: FC = () => {
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const activeStreamsRef = useRef<MediaStream[]>([])
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({
				video: {
					width: { ideal: 1280 },
					height: { ideal: 720 },
					frameRate: { ideal: 30, max: 60 }, // 👈 improves smoothness
				},
				audio: true,
			})
			.then(mediaStream => {
				activeStreamsRef.current.push(mediaStream)
				console.log(mediaStream)

				if (videoRef.current) {
					videoRef.current.srcObject = mediaStream
				}
			})
			.catch(err => {
				console.error('Error accessing camera:', err)
			})

		return () => {
			const activeStreams = activeStreamsRef.current
			activeStreamsRef.current = []

			if (activeStreams.length > 0) {
				activeStreams.forEach(stream => {
					stream.getTracks().forEach(track => track.stop())
				})
			}
		}
	}, [])

	return (
		<div>
			<video
				ref={videoRef}
				autoPlay
				playsInline
				muted
				className='mt-4 w-80 h-60 bg-black rounded-lg shadow'
			/>
		</div>
	)
}
