'use client'

import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Camera, Mic } from 'lucide-react'
import { FC, useState, useCallback } from 'react'

import { CameraTab } from '../components/camera-tab'
import { MicTab } from '@/components/mic-tab'

type TabName = 'camera' | 'microphone'

interface TextProps {
	feeling: string
	percent: number
}

interface AdviceProps {
	advice: string
	advice_number: number
}

const Feeling_container: FC<TextProps> = ({ feeling, percent }) => {
	return (
		<div className='flex size-fit w-[90%] mb-[10px] m-auto justify-evenly mt-0'>
			<p className='p-[10px] rounded-2xl bg-[#4188ff] text-center w-[54%] size-fit text-[#f2f2f2]'>
				{feeling}
			</p>
			<p className='p-[10px] rounded-2xl bg-[#4188ff] text-center w-[30%] size-fit text-[#f2f2f2]'>
				{percent}%
			</p>
		</div>
	)
}

const Advice_container: FC<AdviceProps> = ({ advice, advice_number }) => {
	return (
		<div className='mb-[30px]'>
			<h3 className='max-w-[80%] m-auto p-[10px] overflow-auto text-[#f2f2f2] '>
				Advice №{advice_number}
			</h3>
			<p className='max-w-[80%] m-auto p-[10px] rounded-2xl overflow-auto text-[#f2f2f2] bg-[#4188ff] '>
				{advice}
			</p>
		</div>
	)
}

function loop_feeling_container() {
	const items = []
	const feelings = [
		'Scared',
		'Tired',
		'Happy',
		'Sad',
		'Anxious',
		'Bored',
		'Curious',
	]

	items.push(
		<h2 className='mt-[10px] mb-[20px] p-[10px] text-center text-[#f2f2f2]'>
			Analysis Based On Psychological Behaviour
		</h2>
	)

	for (let i = 0; i < feelings.length; i++) {
		items.push(
			<Feeling_container
				feeling={feelings[i % feelings.length]}
				percent={((i * 100) / 100) * 10}
			/>
		)
	}
	return <div className='h-[100%] overflow-auto remove-scrollbar'>{items}</div>
}

function loop_advice_component() {
	const items = []

	items.push(
		<h2 className='mt-[10px] p-[10px] text-center text-[#f2f2f2]'>
			Advices Based On Analysis
		</h2>
	)

	for (let i = 0; i < 5; i++) {
		items.push(
			<Advice_container
				advice='Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, inventore. Ea nulla nisi consequatur pariatur, debitis voluptatum quam rerum et aut odit reprehenderit blanditiis, quas suscipit? Iure repudiandae eius labore.'
				advice_number={i + 1}
			/>
		)
	}
	return <div className='h-[100%] overflow-auto remove-scrollbar'>{items}</div>
}

export default function Home() {
	const [tab, setTab] = useState<TabName>('camera')

	const renderTabContent = useCallback(() => {
		switch (tab) {
			case 'camera':
				return <CameraTab />
			case 'microphone':
				return <MicTab />
			default:
				return <CameraTab />
		}
	}, [tab])

	return (
		<main className='w-full h-screen overflow-hidden'>
			<div className='flex w-full h-full'>
				<div className='flex-1 h-full border-r border-r-gray-400 p-4 flex flex-col justify-between items-center bg-[#accbff]'>
					<Tabs
						defaultValue='camera'
						className='flex flex-col justify-between items-center'
						value={tab}
						onValueChange={value => setTab(value as TabName)}
					>
						<TabsList className=''>
							<TabsTrigger value='camera' className='cursor-pointer'>
								<Camera className='h-16 w-16' />
							</TabsTrigger>
							<TabsTrigger value='microphone' className='cursor-pointer'>
								<Mic className='h-16 w-16' />
							</TabsTrigger>
						</TabsList>
					</Tabs>
					<div>{renderTabContent()}</div>
					<div>
						<Button>Start recording</Button>
					</div>
				</div>
				<div className='flex-1 bg-[#accbff]'>
					<div className='m-auto mt-[30px] w-[80%] h-[300px] rounded-[20px] bg-[#78aaff] p-[10px]'>
						{loop_feeling_container()}
					</div>
					<div className='m-auto mt-[30px] w-[80%] h-[300px] rounded-[20px] bg-[#78aaff] p-[10px]'>
						{loop_advice_component()}
					</div>
				</div>
			</div>
		</main>
	)
}
