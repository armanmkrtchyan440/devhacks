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

export default function TermsPage() {
	return <div className="w-[100%] h-[100%] p-[30px]">
		<div className="fixed left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-[11px] w-[100%] h-fit shadow-md p-[20px] navbar-style">
			<ul className="flex w-[90%] justify-evenly m-auto">
				<ListItem href="/ai" name="Get Started" />
				<ListItem href="/terms" name="Terms of Use" />
				<ListItem href="/" name="Home" />
			</ul>
		</div>
		<div className="mt-[70px] mb-[20px]">
			<h2 className="mb-[20px] text-center text-[40px] font-bold text-white">
				Terms of Use
			</h2>
			<div className='w-[90%] h-fit space-y-4 text-sm leading-relaxed m-auto'>
				<p className="w-[100%] m-auto text-justify mb-[20px] text-white">
					Welcome to <strong>INQ-AI</strong> (“we,” “our,” or
					“us”). By accessing or using our website and related
					services, including features that utilize your
					<strong>
						{' '}
						camera and microphone for psychological analysis
					</strong>
					, you agree to be bound by these Terms.
				</p>

				<h3 className='font-semibold text-base text-white'>
					1. Acceptance of Terms
				</h3>
				<p className="ml-[18px] text-white">
					By using our Services, you agree to comply with and be
					legally bound by these Terms. If you disagree with any
					part, please do not use our Services.
				</p>

				<h3 className='font-semibold text-base text-white'>
					2. Use of Camera and Microphone
				</h3>
				<ul className='list-disc ml-6 space-y-1 text-white'>
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

				<h3 className='font-semibold text-base text-white'>
					3. Data Collection and Privacy
				</h3>
				<p className="ml-[18px] text-white">
					We collect video/audio recordings, facial expressions,
					voice tone, and session metadata. This is handled
					securely and in accordance with our Privacy Policy.
				</p>
				<p className='ml-[18px] italic text-white'>
					We will never access or record your devices without
					explicit permission.
				</p>

				<h3 className='font-semibold text-base text-white'>
					4. Storage and Retention
				</h3>
				<ul className='list-disc ml-6 space-y-1 text-white'>
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

				<h3 className='font-semibold text-base text-white'>5. Disclaimer</h3>
				<p className="ml-[18px] text-white">
					Our tools are for self-improvement and wellness only.
					They do not replace medical or psychological diagnosis
					or treatment.
				</p>

				<h3 className='font-semibold text-base text-white'>
					6. User Conduct
				</h3>
				<ul className='list-disc ml-6 space-y-1 text-white'>
					<li>No misuse or disruption of Services.</li>
					<li>No impersonation or false information.</li>
					<li>Do not record or redistribute without consent.</li>
				</ul>

				<h3 className='font-semibold text-base text-white'>
					7. Intellectual Property
				</h3>
				<p className="ml-[18px] text-white">
					All content and tools on this site are owned by Inq AI
					and may not be reused without permission.
				</p>

				<h3 className='font-semibold text-base text-white'>8. Changes</h3>
				<p className="ml-[18px] text-white">
					We may update these Terms from time to time. Continued
					use indicates acceptance of any changes.
				</p>

				<h3 className='font-semibold text-base text-white'>9. Contact</h3>
				<p className="ml-[18px] text-white">
					Questions? Email us at <strong>support@inq.ai</strong>{' '}
					or visit <strong>www.inq.ai</strong>.
				</p>
			</div>
		</div>
	</div>
}
