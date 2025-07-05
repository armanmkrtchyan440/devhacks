'use client'

import { FC, useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'

interface MicTabProps {
	isRecording: boolean
}

export const MicTab: FC<MicTabProps> = ({ isRecording }) => {
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
			<div className='w-full' ref={containerRef}></div>
		</div>
	)
}
