import Link from "next/link";
import Image from "next/image";
import { FC } from "react";

interface ListProps {
	name: string,
	href: string
};

const ListItem: FC<ListProps> = ({ name, href }) => {
	return <li className="mb-[20px] p-[10px] rounded-2xl text-center bg-[#E0E0E0]">
		<Link href={href}>{name}</Link>
	</li>
}

export default function HomePage() {
	return <div>
		<div className="mt-[20px]">
			<h2 className="mb-[20px] text-center text-[40px] font-bold">
				About Us
			</h2>
			<p className="w-[90%] m-auto text-justify">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia explicabo incidunt reprehenderit sequi voluptatibus, quo eveniet qui hic eaque alias. Animi eligendi porro corporis modi cumque ea accusamus, voluptatum dignissimos!
				Quisquam atque sequi nesciunt vel rerum voluptatibus ut tempora dolorum alias doloribus. Quod, dolores earum libero suscipit neque odio id error, quos excepturi obcaecati saepe sit iure consectetur magni accusantium.
				Pariatur consectetur, id quam tenetur iste quos illo nesciunt voluptatibus dolor non quis voluptate, dolore itaque corporis? Eius, libero vero aperiam non dolores explicabo, provident, nostrum quasi porro doloremque distinctio!
				Iusto iure dolorem illum accusamus vel similique autem minima, maxime quidem ullam. Ea nam dolor commodi possimus facilis, veritatis quibusdam ex adipisci optio tenetur maiores dicta repudiandae ducimus sapiente? Repellat!
				A, deleniti impedit! Cupiditate, est laboriosam modi earum, eius accusamus aliquid recusandae fugiat ullam, cumque perferendis! Veritatis doloribus nulla distinctio aspernatur hic, accusamus numquam? Assumenda non saepe recusandae doloremque quasi!
			</p>
		</div>

		<div>
			<h2 className="mb-[20px] text-center text-[40px] font-bold">
				Our Goals
			</h2>
			<p className="w-[90%] m-auto text-justify">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia explicabo incidunt reprehenderit sequi voluptatibus, quo eveniet qui hic eaque alias. Animi eligendi porro corporis modi cumque ea accusamus, voluptatum dignissimos!
				Quisquam atque sequi nesciunt vel rerum voluptatibus ut tempora dolorum alias doloribus. Quod, dolores earum libero suscipit neque odio id error, quos excepturi obcaecati saepe sit iure consectetur magni accusantium.
				Pariatur consectetur, id quam tenetur iste quos illo nesciunt voluptatibus dolor non quis voluptate, dolore itaque corporis? Eius, libero vero aperiam non dolores explicabo, provident, nostrum quasi porro doloremque distinctio!
				Iusto iure dolorem illum accusamus vel similique autem minima, maxime quidem ullam. Ea nam dolor commodi possimus facilis, veritatis quibusdam ex adipisci optio tenetur maiores dicta repudiandae ducimus sapiente? Repellat!
				A, deleniti impedit! Cupiditate, est laboriosam modi earum, eius accusamus aliquid recusandae fugiat ullam, cumque perferendis! Veritatis doloribus nulla distinctio aspernatur hic, accusamus numquam? Assumenda non saepe recusandae doloremque quasi!
			</p>
		</div>
	</div>
}