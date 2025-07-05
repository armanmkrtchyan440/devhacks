'use client'

import {
	createContext,
	FC,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'

const WebSocketContext = createContext<WebSocket | null>(null)

interface WebSocketProviderProps {
	children: React.ReactNode
	url: string
}

export const WebSocketProvider: FC<WebSocketProviderProps> = ({
	children,
	url,
}) => {
	const [webSocket, setWebSocket] = useState<WebSocket | null>(null)
	const reconnectAttemptsRef = useRef(0)
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const connectWebSocket = useCallback(() => {
		const socket = new WebSocket(url)

		socket.onopen = () => {
			console.log('[WebSocket] Connected')
			reconnectAttemptsRef.current = 0
			setWebSocket(socket)
		}

		socket.onclose = () => {
			console.warn('[WebSocket] Disconnected. Attempting to reconnect...')
			const timeout = Math.min(10000, 1000 * 2 ** reconnectAttemptsRef.current)
			reconnectTimeoutRef.current = setTimeout(connectWebSocket, timeout)
			reconnectAttemptsRef.current += 1
		}

		socket.onerror = err => {
			console.error('[WebSocket] Error:', err)
		}
	}, [url])

	useEffect(() => {
		connectWebSocket()
		return () => {
			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current)
			}
			webSocket?.close()
		}
	}, [connectWebSocket])

	return (
		<WebSocketContext.Provider value={webSocket}>
			{children}
		</WebSocketContext.Provider>
	)
}

export const useWebSocket = () => {
	const context = useContext(WebSocketContext)

	const sendMessage = useCallback(
		(message: unknown) => {
			if (context?.readyState === WebSocket.OPEN) {
				context.send(JSON.stringify(message))
			} else {
				console.warn('[WebSocket] Message not sent, socket not open.')
			}
		},
		[context]
	)

	const onMessage = useCallback(
		(callback: (data: unknown) => void) => {
			if (!context) {
				console.warn('[WebSocket] Cannot set onMessage, socket is null.')
				return
			}
			context.onmessage = event => {
				try {
					const data = JSON.parse(event.data)
					callback(data)
				} catch (error) {
					console.error('[WebSocket] Failed to parse message:', event.data)
				}
			}
		},
		[context]
	)

	const onError = useCallback(
		(callback: (error: Event) => void) => {
			if (!context) {
				console.warn('[WebSocket] Cannot set onError, socket is null.')
				return
			}
			context.onerror = callback
		},
		[context]
	)

	const onClose = useCallback(
		(callback: () => void) => {
			if (!context) {
				console.warn('[WebSocket] Cannot set onClose, socket is null.')
				return
			}
			context.onclose = callback
		},
		[context]
	)

	return useMemo(
		() => ({
			sendMessage,
			onMessage,
			onError,
			onClose,
			socket: context,
		}),
		[sendMessage, onMessage, onError, onClose, context]
	)
}
