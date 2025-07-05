'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Camera, Mic } from 'lucide-react'
import { FC, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { CameraTab } from '@/components/ai/camera-tab'
import { MicTab } from '@/components/ai/mic-tab'
import { useSearchParams } from 'next/navigation'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { WebSocketProvider } from '@/providers/websocket'
import { clsx } from 'clsx'

type TabName = 'camera' | 'microphone'

interface TextProps {
	feeling: string
	percent: number
}

// FeelingItem component with hover animations and effects
const FeelingItem: FC<TextProps> = ({ feeling, percent }) => {
	const [loadingPercent, setLoadingPercent] = useState(0)

	// Animation for loading percentage from 0 to actual value
	useEffect(() => {
		const interval = setInterval(() => {
			setLoadingPercent(prev => {
				const next = Math.min(prev + 1, percent)
				if (next === percent) clearInterval(interval)
				return next
			})
		}, 5) // Adjust the speed of the animation here (lower is faster)
		return () => clearInterval(interval) // Cleanup interval when unmounted
	}, [percent])

	// Helper function to get the color of each feeling based on percentage
	const getFeelingColor = (percent: number) => {
		if (percent < 30) return '#e74c3c';  // Stress (Red)
		if (percent < 50) return '#f39c12';  // Anxiety (Yellow)
		if (percent < 70) return '#f39c12';  // Relaxation (Yellow)
		if (percent < 90) return '#2ecc71';  // Happiness (Green)
		return '#1abc9c';  // Euphoria (Teal)
	}

	return (
		<motion.div
			className="w-[90%] m-auto mb-[20px] p-[15px] rounded-xl shadow-lg"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 1 }}
			style={{
				boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
				border: '1px solid rgba(255, 255, 255, 0.3)'
			}}
			whileHover={{
				scale: 1.05, // Scale the item slightly when hovered
				boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)', // Increase shadow on hover
				transition: { type: 'spring', stiffness: 300, damping: 20 }
			}}
		>
			<div className='w-full flex justify-between items-center text-white font-medium text-lg'>
				<p>{feeling}</p>
				<p>{loadingPercent}%</p>
			</div>
			<div className='w-full h-2 rounded-full bg-gray-500 overflow-hidden'>
				<motion.div
					className='h-full'
					style={{
						width: `${loadingPercent}%`,
						backgroundColor: getFeelingColor(loadingPercent),
						borderRadius: '50px',
					}}
					animate={{ width: `${loadingPercent}%` }}
					transition={{ duration: 2, ease: 'easeInOut' }}
				></motion.div>
			</div>
		</motion.div>
	)
}

// Updated FeelingContainer with no background
function FeelingContainer() {
	const feelings = [
		'Neutral',
		'Stress',
		'Anxiety',
		'Relaxation',
		'Sadness',
		'Happiness',
		'Euphoria',
		'Depression',
		'Anger',
		'Scared'
	]

	return (
		<ScrollArea className='h-[100%] overflow-auto'>
			{feelings.map((feeling, index) => (
				<FeelingItem
					key={index}
					feeling={feeling}
					percent={Math.min((index + 1) * 10, 100)} // Ensures max percent 100%
				/>
			))}
		</ScrollArea>
	)
}

export default function Home() {
	const searchParams = useSearchParams()
	const [tab, setTab] = useState<TabName>(
		(searchParams.get('tab') as TabName) || 'camera'
	)
	const { setItem, getItem } = useLocalStorage<string>('isFirstStart')

	if (getItem() === undefined) {
		setItem('true')
	}

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

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
		<WebSocketProvider url={process.env.NEXT_PUBLIC_WEBSOCKET_URL || ''}>
			<main className='w-full h-screen overflow-hidden'>
				<div className='flex w-full h-full transition-all duration-300 ease-in-out'>
					{/* Left Side */}
					<div
						className={clsx(
							'w-full h-full border-r-[3px] border-r-[#e0e0e0] p-4 flex flex-col justify-between items-center transition-all duration-300 ease-in-out',
							{
								'max-w-full': tab === 'microphone',
								'max-w-1/2': tab === 'camera',
							}
						)}
					>
						<Tabs
							defaultValue='camera'
							className='flex flex-col justify-between items-center w-full'
							value={tab}
							onValueChange={value => setTab(value as TabName)}
						>
							<div className='w-full'>
								<Button variant={'default'} asChild className='w-fit h-fit'>
									<Link href='/'>Return to home page</Link>
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
						<AnimatePresence mode='wait'>
							<motion.div
								key={tab}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.4 }}
								className='w-full h-full'
							>
								{renderTabContent()}
							</motion.div>
						</AnimatePresence>
					</div>

					{/* Right Side - Psychological Behaviour Analysis */}
					{tab === 'camera' && (
						<div className='w-1/2 flex justify-center items-center h-full'>
							<div className='w-[90%] max-w-[600px] p-[20px] bg-gradient-to-r rounded-[20px] shadow-lg border border-gray-500'>
								<FeelingContainer />
							</div>
						</div>
					)}
				</div>

				<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Confirm Action</DialogTitle>
							<DialogDescription>
								Please read our terms and conditions before proceeding.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button
								variant='secondary'
								onClick={() => setIsModalOpen(false)}
							>
								Cancel
							</Button>
							<Button
								onClick={() => {
									setItem('false')
									setIsModalOpen(false)
								}}
							>
								Proceed
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</main>
		</WebSocketProvider>
	)
}