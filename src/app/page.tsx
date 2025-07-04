'use client'

import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Camera, Mic } from 'lucide-react'
import { CameraTab } from '../components/camera-tab'
import { useCallback, useState } from 'react'
import { MicTab } from '@/components/mic-tab'

type TabName = 'camera' | 'microphone'

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
				<div className='flex-1 h-full border-r border-r-gray-400 p-4 flex flex-col justify-between items-center'>
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
				<div className='flex-1'></div>
			</div>
		</main>
	)
}
