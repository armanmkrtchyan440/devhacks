import Link from "next/link";
import { FC } from "react";

interface ListProps {
	name: string,
	href: string
};

const ListItem: FC<ListProps> = ({ name, href }) => {
	return <li className="p-[10px] bg-[#E0E0E0] rounded-2xl">
		<Link href={href}>{name}</Link>
	</li>
}

export default function HomePage() {
	return <main className="bg-[#dbd1be] min-h-screen">
		<div className="w-[100%] h-fit p-[20px] bg-[#cdbb9e]">
			<div className="w-[70%] h-fit m-auto">
				<ul className="flex justify-evenly text-gray-800">
					<ListItem name="About" href="/about" />
					<ListItem name="Terms of Use" href="/terms" />
					<ListItem name="Get Started" href="/app" />
				</ul>
			</div>
		</div>
	</main>
}