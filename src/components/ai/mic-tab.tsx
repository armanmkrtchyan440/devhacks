'use client'

import { useSendMediaToAi } from '@/api'
import clsx from 'clsx'
import { FC, useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'
import { ReactTyped } from 'react-typed'
import { ScrollArea } from '../ui/scroll-area'

export const MicTab: FC = () => {
	const [isRecording, setIsRecording] = useState<boolean>(false)

	const containerRef = useRef<HTMLDivElement | null>(null)
	const waveSurferRef = useRef<WaveSurfer | null>(null)
	const recordRefPlugin = useRef<RecordPlugin | null>(null)
	const { mutate: sendAudio, isPending, data } = useSendMediaToAi()

	useEffect(() => {
		if (containerRef.current) {
			waveSurferRef.current = WaveSurfer.create({
				container: containerRef.current,
				interact: false,
				plugins: [RecordPlugin.create()],
			})

			recordRefPlugin.current =
				waveSurferRef.current.getActivePlugins()[0] as RecordPlugin

			recordRefPlugin.current?.on('record-data-available', blob => {
				sendAudio(blob, {
					onSuccess: async data => {
						const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${data.audio_url}`
						const wavesurfer = waveSurferRef.current

						// Load audio into WaveSurfer
						wavesurfer?.load(url)

						// When ready, play audio and animate
						wavesurfer?.once('ready', async () => {
							wavesurfer.play()
						})
					},
				})
			})
		}

		return () => {
			recordRefPlugin.current?.stopRecording()
			waveSurferRef.current?.destroy()
		}
	}, [sendAudio])

	useEffect(() => {
		if (isRecording) {
			recordRefPlugin.current?.startRecording()
		} else {
			recordRefPlugin.current?.stopRecording()
		}
	}, [isRecording])

	return (
		<div className='min-w-96 flex flex-col items-center'>
			<div ref={containerRef} className='hidden'></div>

			<div
				className='sphere-container'
				onClick={() => setIsRecording(!isRecording)}
			>
				<div className={clsx('sphere', { active: isRecording })} id='sphere'>
					<div className='sphere-core'></div>

					<div className='energy-rings'>
						<div className='energy-ring'></div>
						<div className='energy-ring'></div>
						<div className='energy-ring'></div>
					</div>

					<div className='particle-field'>
						<div className='particle'></div>
						<div className='particle'></div>
						<div className='particle'></div>
						<div className='particle'></div>
						<div className='particle'></div>
						<div className='particle'></div>
						<div className='particle'></div>
						<div className='particle'></div>
					</div>

					{isRecording && (
						<div className='energy-waves'>
							<div className='energy-wave'></div>
							<div className='energy-wave'></div>
							<div className='energy-wave'></div>
							<div className='energy-wave'></div>
						</div>
					)}

					<div
						className={clsx('voice-waves', { active: isRecording })}
						id='voiceWaves'
					>
						<div className='voice-wave'></div>
						<div className='voice-wave'></div>
						<div className='voice-wave'></div>
						<div className='voice-wave'></div>
					</div>
				</div>
			</div>

			<div className='max-w-[800px] w-full  p-[30px] bg-[#14143cb3] rounded-[20px] shadow-[0_10px_30px_#1e90ff33] backdrop-blur-md border border-[#1e90ff4d]'>
				<div className='text-lg text-[#b0b0dd] mb-[20px] text-center'>
					{isPending
						? 'Processing...'
						: isRecording
						? 'Listening...'
						: 'Click the button to start recording'}
				</div>
				{((data && !isRecording) || !isPending) && (
					<ScrollArea className='max-h-[100px] overflow-auto'>
						<div className='text-left text-[#e0e0ff]'>
							<ReactTyped
								strings={[data?.bot_answer || '']}
								typeSpeed={40}
								className='text-[#e0e0ff]'
								showCursor={false}
							/>
						</div>
					</ScrollArea>
				)}
			</div>
		</div>
	)
}
