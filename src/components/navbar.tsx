import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

interface ListProps {
	name: string
	href: string
}

const ListItem: FC<ListProps> = ({ name, href }) => {
	return (
		<li className='mb-[20px] p-[10px] rounded-2xl text-center bg-[#E0E0E0]'>
			<Link href={href}>{name}</Link>
		</li>
	)
}

export const Navbar = () => {
	return (
		<div className='min-w-[300px] w-[300px] p-[20px] bg-[#cdbb9e]'>
			<div className='flex m-auto mb-[50px] justify-center'>
				<h1 className='text-center text-[40px] font-bold'>INQ-AI</h1>
				<div className='ml-[10px]'>
					<Image
						width={0}
						height={0}
						sizes='100vw'
						src='/logo.png'
						alt='logo'
						className='w-[40px] mt-[15px]'
					/>
				</div>
			</div>
			<div className='w-[70%] h-fit m-auto'>
				<ul className='flex flex-col text-gray-800'>
					<ListItem name='Get Started' href='/ai' />
					<ListItem name='Home' href='/' />
					<ListItem name='Term Of Use' href='/terms' />
				</ul>
			</div>
		</div>
	)
}
