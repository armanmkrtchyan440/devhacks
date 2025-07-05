export default function TermsPage() {
	return <div className="w-[100%] h-full">
		<div className="mt-[20px]">
			<h2 className="mb-[20px] text-center text-[40px] font-bold">
				Terms of Use
			</h2>
			<div className='w-[90%] h-[570px] space-y-4 text-sm leading-relaxed m-auto overflow-auto remove-scrollbar'>
				<p className="w-[100%] m-auto text-justify mb-[20px]">
					Welcome to <strong>INQ-AI</strong> (“we,” “our,” or
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
				<p className="ml-[18px]">
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
				<p className="ml-[18px]">
					We collect video/audio recordings, facial expressions,
					voice tone, and session metadata. This is handled
					securely and in accordance with our Privacy Policy.
				</p>
				<p className='ml-[18px] italic'>
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

				<h3 className='font-semibold text-base'>5. Disclaimer</h3>
				<p className="ml-[18px]">
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
					<li>Do not record or redistribute without consent.</li>
				</ul>

				<h3 className='font-semibold text-base'>
					7. Intellectual Property
				</h3>
				<p className="ml-[18px]">
					All content and tools on this site are owned by Inq AI
					and may not be reused without permission.
				</p>

				<h3 className='font-semibold text-base'>8. Changes</h3>
				<p className="ml-[18px]">
					We may update these Terms from time to time. Continued
					use indicates acceptance of any changes.
				</p>

				<h3 className='font-semibold text-base'>9. Contact</h3>
				<p className="ml-[18px]">
					Questions? Email us at <strong>support@inq.ai</strong>{' '}
					or visit <strong>www.inq.ai</strong>.
				</p>
			</div>
		</div>
	</div>
}
