'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Camera, Mic } from 'lucide-react'
import { FC, useState, useCallback } from 'react'
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
				<div
					className='bg-[#b0a27b] h-full'
					style={{
						width: `${percent}%`,
					}}
				></div>
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
					<div
						className={clsx(
							'w-full h-full border-r-[3px] border-r-[#9a9a9a] p-4 flex flex-col justify-between items-center transition-all duration-300 ease-in-out',
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
								key={tab} // key must change to trigger animation
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
					{tab === 'camera' && (
						<div className='w-1/2'>
							<div className='m-auto mt-[30px] w-[80%] h-[300px] p-[10px] rounded-[20px] bg-background shadow-sm border border-gray-300'>
								<FeelingContainer />
							</div>
							<div className='m-auto mt-[30px] w-[80%] h-[300px] p-[10px] rounded-[20px] bg-background shadow-lg border border-gray-300'>
								<AdviceContainer
									advices={[
										'Stay positive',
										'Keep learning',
										'Practice mindfulness',
									]}
								/>
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
						<div>
							<div className='text-sm text-gray-700'>
								By clicking {'"'}Proceed{'"'}, you agree to{' '}
								<Dialog>
									<DialogTrigger asChild>
										<Button variant='link' className='p-0'>
											our terms and conditions
										</Button>
									</DialogTrigger>
									<DialogContent className='max-w-2xl max-h-[80vh]'>
										<DialogHeader>
											<DialogTitle>Terms and Conditions</DialogTitle>
											<DialogDescription>
												Last updated: October 1, 2023
											</DialogDescription>
										</DialogHeader>

										<ScrollArea className='max-h-[60vh] pr-2'>
											<div className='space-y-4 text-sm leading-relaxed'>
												<p>
													Welcome to <strong>Inq Ai</strong> (“we,” “our,” or
													“us”). By accessing or using our website and related
													services, including features that utilize your
													<strong>
														{' '}
														camera and microphone for psychological analysis
													</strong>
													, you agree to be bound by these Terms.
												</p>

												<h3 className='font-semibold text-base'>
													1. Acceptance of Terms
												</h3>
												<p>
													By using our Services, you agree to comply with and be
													legally bound by these Terms. If you disagree with any
													part, please do not use our Services.
												</p>

												<h3 className='font-semibold text-base'>
													2. Use of Camera and Microphone
												</h3>
												<ul className='list-disc ml-6 space-y-1'>
													<li>
														You explicitly consent to the use of your audio and
														video for psychological analysis.
													</li>
													<li>
														You confirm that you are 18 years or older (or have
														legal consent if under 18).
													</li>
													<li>
														You understand data may be processed by AI models or
														professionals.
													</li>
												</ul>

												<h3 className='font-semibold text-base'>
													3. Data Collection and Privacy
												</h3>
												<p>
													We collect video/audio recordings, facial expressions,
													voice tone, and session metadata. This is handled
													securely and in accordance with our Privacy Policy.
												</p>
												<p className='italic'>
													We will never access or record your devices without
													explicit permission.
												</p>

												<h3 className='font-semibold text-base'>
													4. Storage and Retention
												</h3>
												<ul className='list-disc ml-6 space-y-1'>
													<li>
														Data may be stored securely for quality and service
														improvements.
													</li>
													<li>
														You can request data deletion anytime via [Insert
														Email].
													</li>
													<li>We do not sell your data to third parties.</li>
												</ul>

												<h3 className='font-semibold text-base'>
													5. Disclaimer
												</h3>
												<p>
													Our tools are for self-improvement and wellness only.
													They do not replace medical or psychological diagnosis
													or treatment.
												</p>

												<h3 className='font-semibold text-base'>
													6. User Conduct
												</h3>
												<ul className='list-disc ml-6 space-y-1'>
													<li>No misuse or disruption of Services.</li>
													<li>No impersonation or false information.</li>
													<li>
														Do not record or redistribute without consent.
													</li>
												</ul>

												<h3 className='font-semibold text-base'>
													7. Intellectual Property
												</h3>
												<p>
													All content and tools on this site are owned by Inq AI
													and may not be reused without permission.
												</p>

												<h3 className='font-semibold text-base'>8. Changes</h3>
												<p>
													We may update these Terms from time to time. Continued
													use indicates acceptance of any changes.
												</p>

												<h3 className='font-semibold text-base'>9. Contact</h3>
												<p>
													Questions? Email us at <strong>support@inq.ai</strong>{' '}
													or visit <strong>www.inq.ai</strong>.
												</p>
											</div>
										</ScrollArea>

										<DialogFooter>
											<Button onClick={() => {}}>Close</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
								. Please ensure you have read and understood them.
							</div>
						</div>
						<DialogFooter>
							<Button
								variant='secondary'
								onClick={() => {
									setIsModalOpen(false)
								}}
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
