import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	env: {
		WEBSOCKET_URL: process.env.WEBSOCKET_URL,
	},
}

export default nextConfig
