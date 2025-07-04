'use client'

import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Camera, Mic } from 'lucide-react'
import { CameraTab } from './components/camera-tab'
import { useState } from 'react'

type TabName = 'camera' | 'microphone'

const tabs: Record<TabName, { component: React.FC }> = {
	camera: {
		component: CameraTab,
	},
	microphone: {
		component: () => <div>Microphone Tab</div>,
	},
}

export default function Home() {
	const [tab, setTab] = useState<TabName>('camera')
	const SelectedTab = tabs[tab].component
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
					<div>{<SelectedTab />}</div>
					<div>
						<Button>Start recording</Button>
					</div>
				</div>
				<div className='flex-1'></div>
			</div>
		</main>
	)
}
