import { useEffect, useRef, useCallback } from 'react'

interface WebSocketOptions {
	onMessage?: (data: unknown) => void
	onError?: (error: Event) => void
	onOpen?: () => void
	onClose?: () => void
}

export const useWebSocket = (
	url: string,
	isActive: boolean,
	options?: WebSocketOptions
) => {
	const socketRef = useRef<WebSocket | null>(null)

	const sendMessage = useCallback((message: unknown) => {
		if (socketRef.current?.readyState === WebSocket.OPEN) {
			socketRef.current.send(JSON.stringify(message))
		}
	}, [])

	useEffect(() => {
		if (!isActive) return

		const socket = new WebSocket(url)
		socketRef.current = socket

		socket.onopen = () => console.log('WebSocket connected.')

		socket.onmessage = event => {
			try {
				const parsed = JSON.parse(event.data)
				options?.onMessage?.(parsed)
			} catch (err) {
				console.error('Failed to parse WebSocket message:', event.data)
			}
		}

		socket.onerror = err => {
			console.error('WebSocket error:', err)
			options?.onError?.(err)
		}
		socket.onclose = () => {
			console.log('WebSocket closed.')
			options?.onClose?.()
		}

		return () => {
			socket.close()
		}
	}, [url, isActive, options])

	return { sendMessage }
}
