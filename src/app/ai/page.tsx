'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Camera, Mic } from 'lucide-react'
import { FC, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { CameraTab } from '@/components/ai/camera-tab'
import { MicTab } from '@/components/ai/mic-tab'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useWebSocket, WebSocketProvider } from '@/providers/websocket'
import { clsx } from 'clsx'
import { useSendMediaToAi } from '@/api'
import { randomInteger } from '@/lib/utils'

type TabName = 'camera' | 'microphone'

interface TextProps {
	feeling: string
	percent: number
}

const feelingColors: Record<string, string> = {
	Neutral: '#9CA3AF',
	Stress: '#F59E0B',
	Anxiety: '#EF4444',
	Relaxation: '#6EE7B7',
	Sadness: '#3B82F6',
	Happiness: '#FBBF24',
	Euphoria: '#A855F7',
	Depression: '#4B5563',
	Anger: '#DC2626',
	Scared: '#F472B6',
}

const FeelingItem: FC<TextProps> = ({ feeling, percent }) => {
	const [loadingPercent, setLoadingPercent] = useState(0)

	useEffect(() => {
		const interval = setInterval(() => {
			setLoadingPercent(prev => {
				const next = Math.min(prev + 1, percent)
				if (next === percent) clearInterval(interval)
				return next
			})
		}, 5)
		return () => clearInterval(interval)
	}, [percent])

	const getFeelingColor = (feeling: string) => {
		return feelingColors[feeling]
	}

	return (
		<motion.div
			className='w-full m-auto p-[15px] rounded-xl shadow-lg'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 1 }}
			style={{
				boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
				border: '1px solid rgba(255, 255, 255, 0.3)',
			}}
			whileHover={{
				scale: 1.05,
				boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
				transition: { type: 'spring', stiffness: 300, damping: 20 },
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
						backgroundColor: getFeelingColor(feeling),
						borderRadius: '50px',
					}}
					animate={{ width: `${loadingPercent}%` }}
					transition={{ duration: 0.8, ease: 'easeInOut' }}
				></motion.div>
			</div>
		</motion.div>
	)
}

interface FeelingContainerProps {
	feelings: { name: string; percent: number }[]
}

const FeelingContainer: FC<FeelingContainerProps> = ({ feelings }) => {
	return (
		<div className='grid grid-cols-2 gap-4'>
			{feelings.map((feeling, index) => (
				<FeelingItem
					key={index}
					feeling={feeling.name}
					percent={feeling.percent} // Ensures max percent 100%
				/>
			))}
		</div>
	)
}

export default function Home() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [tab, setTab] = useState<TabName>(
		(searchParams.get('tab') as TabName) || 'camera'
	)
	const { setItem, getItem } = useLocalStorage<string>('isFirstStart')
	const [feelings, setFeelings] = useState([
		{ name: 'Neutral', percent: 0 },
		{ name: 'Stress', percent: 0 },
		{ name: 'Anxiety', percent: 0 },
		{ name: 'Relaxation', percent: 0 },
		{ name: 'Sadness', percent: 0 },
		{ name: 'Happiness', percent: 0 },
		{ name: 'Euphoria', percent: 0 },
		{ name: 'Depression', percent: 0 },
		{ name: 'Anger', percent: 0 },
		{ name: 'Scared', percent: 0 },
	])

	if (getItem() === undefined) {
		setItem('true')
	}

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const { mutate: sendVideo, data } = useSendMediaToAi()
	const { sendMessage, onMessage } = useWebSocket()
	const [isRecording, setIsRecording] = useState(false)

	const renderTabContent = useCallback(() => {
		switch (tab) {
			case 'camera':
				return (
					<CameraTab
						sendMessage={sendMessage}
						sendVideo={sendVideo}
						isRecording={isRecording}
						setIsRecording={setIsRecording}
					/>
				)
			case 'microphone':
				return <MicTab />
			default:
				return (
					<CameraTab
						sendMessage={sendMessage}
						sendVideo={sendVideo}
						isRecording={isRecording}
						setIsRecording={setIsRecording}
					/>
				)
		}
	}, [isRecording, sendMessage, sendVideo, tab])

	useEffect(() => {
		if (!isRecording) {
			return
		}
		const interval = setInterval(() => {
			setFeelings(prev =>
				prev.map(item => {
					const percent = randomInteger(0, 100)
					return {
						...item,
						percent,
					}
				})
			)
		}, 1000)

		return () => {
			clearInterval(interval)
		}
	}, [isRecording])

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
							onValueChange={value => {
								setTab(value as TabName)
								router.replace(`?tab=${value}`, { scroll: false })
							}}
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
							<ScrollArea className='w-full max-h-full overflow-auto'>
								<div className='mx-auto w-full max-w-[600px] p-[20px] bg-gradient-to-r rounded-[20px] border border-gray-500'>
									<FeelingContainer feelings={feelings} />
								</div>
							</ScrollArea>
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
							<Button variant='secondary' onClick={() => setIsModalOpen(false)}>
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
