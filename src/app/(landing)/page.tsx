import Link from "next/link";
import { FC } from "react";

interface ListProps {
	name: string,
	href: string
};

interface TextProps{
	title: string,
	description: string
};

const ListItem: FC<ListProps> = ({ name, href }) => {
	return <li className="text-center text-white hover:transition-all hover:duration-500 hover:underline">
		<Link className="inline-block p-[10px]" href={href}>{name}</Link>
	</li>
};

const TextListItem: FC<TextProps> = ({title, description}) => {
	return <li className="mt-[20px] text-white">
		<p className="text-[25px] font-bold">{title}</p>
		<p className="mt-[10px]">{description}</p>
	</li>
};

export default function HomePage() {
	return <div className="w-[100%] h-[100%] p-[30px]">
		<div className="fixed left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-[11px] w-[100%] h-fit shadow-md p-[20px] navbar-style">
			<ul className="flex w-[90%] justify-evenly m-auto">
				<ListItem href="/ai" name="Get Started" />
				<ListItem href="/terms" name="Terms of Use" />
				<ListItem href="#about" name="About" />
			</ul>
		</div>
		<div className="mt-[70px]">
			<h1 className="text-center text-[50px] font-bold text-white">INQ-AI</h1>
			<div className="">
				<h2 className="text-center text-[30px] font-bold text-white">Real-Time Psychological Insights, Powered by AI</h2>
			</div>
			<div className="mt-[20px]">
				<p className="w-[80%] m-auto text-justify text-[20px] text-white">
					Have you ever felt something you couldn’t explain? A sudden wave of stress, uncertainty, or even joy—without knowing why?
					You’re not alone. And now, you don’t have to figure it out alone.
					Welcome to your personal space for understanding your mind, powered by cutting-edge AI. Our tool offers real-time psychological analysis designed specifically for individuals like you — thoughtful, curious, and ready to take control of their emotional well-being
				</p>
			</div>
		</div>
		<div className="mt-[30px]">
			<div className="">
				<h2 className="text-center text-[30px] font-bold text-white">What We Do</h2>
			</div>
			<div className="w-[80%] mt-[20px] m-auto">
				<ul className="">
					<TextListItem
						title="Real-Time Emotional Detection"
						description="As you write, speak, or reflect, our AI gently analyzes tone, language, and patterns to help identify your current emotional state — instantly and privately."
					/>
					<TextListItem
						title="Personalized Mental Insights"
						description="From mood trends to cognitive patterns, we offer simple, science-backed insights you can understand and act on. No jargon. No fluff. Just clarity."
					/>
					<TextListItem
						title="Track Your Emotional Growth"
						description="See how your mood evolves over time. Our intuitive dashboards help you spot patterns and triggers — turning everyday moments into personal breakthroughs."
					/>
					<TextListItem
						title="100% Private and Secure"
						description="Your thoughts are yours alone. We never store personal data without your permission. Your journey is safe, private, and always in your control."
					/>
				</ul>
			</div>
		</div>
		<div id="about" className="w-[80%] mt-[30px] m-auto">
			<div className="">
				<h2 className="text-center text-[30px] font-bold text-white">
					About Us
				</h2>
			</div>
			<div>
				<p className="text-white text-[15px] mt-[15px]">
					At the heart of everything we do is a simple belief: <strong> everyone deserves to understand themselves.</strong>
				</p>
				<p className="text-white text-[15px] mt-[15px]">
					We’re a team of psychologists, engineers, designers, and everyday people who believe that mental clarity should be accessible, personal, and stigma-free. Our mission is to bring <strong>real-time psychological insight</strong> to individuals through the power of AI — in a way that feels intuitive, private, and deeply human.
				</p>
				<p className="text-white text-[15px] mt-[15px]">
					Whether you're looking to manage stress, build self-awareness, or simply check in with your emotions throughout the day, our platform is here to help — <strong>without judgment, without complexity.</strong>
				</p>
				<p className="text-white text-[15px] mt-[15px]">
					We’re not trying to replace therapy or offer quick fixes. We’re here to <strong>amplify self-understanding</strong> — and support the journey to better mental well-being, one insight at a time.
				</p>
			</div>
		</div>
	</div>
}