'use client'

import Link from "next/link";
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Camera, Mic } from 'lucide-react'
import { FC, useState, useCallback } from 'react'

import { CameraTab } from '@/components/camera-tab'
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

const FeelingItem: FC<TextProps> = ({ feeling, percent }) => {
	return (
		<div className='w-[80%] m-auto mb-[15px]'>
			<div className='w-full flex justify-between items-center'>
				<p>{feeling}</p>
				<p>{percent}%</p>
			</div>
			<div className='w-full h-2 rounded-full bg-gray-100 overflow-hidden'>
				<div className='bg-[#b0a27b] h-full' style={{
					width: `${percent}%`
				}}></div>
			</div>
		</div>
	)
}

const AdviceItem: FC<AdviceProps> = ({ advice, advice_number }) => {
	return (
		<div className='mb-[30px]'>
			<h3 className='max-w-[80%] m-auto p-[10px] overflow-auto text-[#000]'>
				Advice №{advice_number}
			</h3>
			<p className='max-w-[80%] m-auto p-[10px] rounded-2xl overflow-auto text-[#000] bg-[#b0a27b] '>
				{advice}
			</p>
		</div>
	)
}

function FeelingContainer() {
	const feelings = [
		'Scared',
		'Tired',
		'Happy',
		'Sad',
		'Anxious',
		'Bored',
		'Curious',
	]

	return (
		<div className='h-[100%] overflow-auto remove-scrollbar'>
			<h2 className='mt-[10px] mb-[20px] p-[10px] text-center font-bold text-[#000]'>
				Analysis Based On Psychological Behaviour
			</h2>
			{feelings.map((feeling, index) => (
				<FeelingItem
					key={index}
					feeling={feeling}
					percent={((index * 100) / 100) * 10}
				/>
			))}
		</div>
	)
}

interface AdviceContainerProps {
	advices: string[]
}

const AdviceContainer: FC<AdviceContainerProps> = ({ advices }) => {
	return (
		<div className='h-[100%] overflow-auto remove-scrollbar'>
			<h2 className='mt-[10px] p-[10px] text-center font-bold text-[#000]'>
				Advices Based On Analysis
			</h2>
			{advices.map((advice, index) => (
				<AdviceItem key={index} advice={advice} advice_number={index + 1} />
			))}
		</div>
	)
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
				<div className='flex-1 h-full border-r-[3px] border-r-[#9a9a9a] p-4 flex flex-col justify-between items-center '>
					<Tabs
						defaultValue='camera'
						className='flex flex-col justify-between items-center w-full'
						value={tab}
						onValueChange={value => setTab(value as TabName)}
					>
						<div className="w-full">
							<Button variant={"default"} asChild className='w-fit h-fit'>
								<Link href="/">Return to home page</Link>
							</Button>
						</div>
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
				<div className='flex-1'>
					<div className='m-auto mt-[30px] w-[80%] h-[300px] p-[10px] rounded-[20px] bg-[#cac1a1] shadow-lg'>
						<FeelingContainer />
					</div>
					<div className='m-auto mt-[30px] w-[80%] h-[300px] p-[10px] rounded-[20px] bg-[#cac1a1] shadow-lg'>
						<AdviceContainer
							advices={[
								'Stay positive',
								'Keep learning',
								'Practice mindfulness',
							]}
						/>
					</div>
				</div>
			</div>
		</main>
	)
}
