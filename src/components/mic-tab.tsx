'use client'

import { FC, useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'

export const MicTab: FC = () => {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const waveSurferRef = useRef<WaveSurfer | null>(null)
	const recordRefPlugin = useRef<RecordPlugin | null>(null)
	const [recording, setRecording] = useState(false)

	useEffect(() => {
		if (containerRef.current) {
			waveSurferRef.current = WaveSurfer.create({
				container: containerRef.current,
				waveColor: 'gray',
				interact: false,
				cursorWidth: 0,
				plugins: [RecordPlugin.create()],
			})

			recordRefPlugin.current =
				waveSurferRef.current.getActivePlugins()[0] as RecordPlugin
		}

		return () => {
			recordRefPlugin.current?.stopRecording()
			waveSurferRef.current?.destroy()
		}
	}, [])

	const startRecording = () => {
		if (recordRefPlugin.current && !recording) {
			recordRefPlugin.current.startRecording()
			setRecording(true)
		}
	}

	const stopRecording = () => {
		if (recordRefPlugin.current && recording) {
			recordRefPlugin.current.stopRecording()
			setRecording(false)
		}
	}

	return (
		<div>
			
		</div>
	)

	// return (
	// 	<div className='w-full flex flex-col items-center'>
	// 		<div className='w-full h-40' ref={containerRef}></div>
	// 		<div className='flex gap-4 mt-4'>
	// 			<button
	// 				onClick={startRecording}
	// 				disabled={recording}
	// 				className='bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50'
	// 			>
	// 				Start Recording
	// 			</button>
	// 			<button
	// 				onClick={stopRecording}
	// 				disabled={!recording}
	// 				className='bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50'
	// 			>
	// 				Stop Recording
	// 			</button>
	// 		</div>
	// 	</div>
	// )
}
