'use client'

import { FC, useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'

export const MicTab: FC = () => {
	const [isRecording, setIsRecording] = useState<boolean>(false)
	const containerRef = useRef<HTMLDivElement | null>(null)
	const waveSurferRef = useRef<WaveSurfer | null>(null)
	const recordRefPlugin = useRef<RecordPlugin | null>(null)

	useEffect(() => {
		if (containerRef.current) {
			waveSurferRef.current = WaveSurfer.create({
				container: containerRef.current,
				waveColor: 'gray',
				interact: false,
				cursorWidth: 0,
				plugins: [RecordPlugin.create()],
				width: '100%',
				barHeight: 4,
				barWidth: 2,
				barGap: 4,
				barRadius: 50,
			})

			recordRefPlugin.current =
				waveSurferRef.current.getActivePlugins()[0] as RecordPlugin

			recordRefPlugin.current?.on('record-end', blob => {
				const audioUrl = URL.createObjectURL(blob)
				const audioElement = new Audio(audioUrl)
				audioElement.controls = true
				audioElement.autoplay = true

				// Append the audio element to the container
				if (containerRef.current) {
					containerRef.current.appendChild(audioElement)
				}
			})
		}

		return () => {
			recordRefPlugin.current?.stopRecording()
			waveSurferRef.current?.destroy()
		}
	}, [])

	useEffect(() => {
		if (isRecording) {
			recordRefPlugin.current?.startRecording()
		} else {
			recordRefPlugin.current?.stopRecording()
		}
	}, [isRecording])

	return (
		<div className='min-w-96 flex flex-col items-center'>
			<div
				className='sphere-container'
				onClick={() => setIsRecording(!isRecording)}
			>
				<div className='sphere' id='sphere'>
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

					<div className='energy-waves'>
						<div className='energy-wave'></div>
						<div className='energy-wave'></div>
						<div className='energy-wave'></div>
						<div className='energy-wave'></div>
					</div>

					<div className='voice-waves' id='voiceWaves'>
						<div className='voice-wave'></div>
						<div className='voice-wave'></div>
						<div className='voice-wave'></div>
						<div className='voice-wave'></div>
					</div>
				</div>
			</div>

			<div className='mt-4 text-gray-500'>
				{isRecording ? 'Recording...' : 'Click the button to start recording'}
			</div>
			<div className='mt-4 text-gray-500 text-sm px-40'>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
				obcaecati porro delectus accusamus animi quis incidunt, ullam sint, nisi
				doloremque illum ducimus autem? Qui aut dicta doloremque sint reiciendis
				dolores, quam inventore ullam delectus, fuga ipsa ab dolorum dolorem
				distinctio quasi fugit? Quia aperiam rem molestias totam nisi officiis
				quos non corporis dignissimos sed vitae, quod in, minus explicabo
				pariatur temporibus ipsam nam! Amet repudiandae ipsam magni impedit odit
				numquam.
			</div>
		</div>
	)
}
