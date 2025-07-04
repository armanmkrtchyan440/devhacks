import { useEffect, useRef } from 'react'

type MessageHandler = (message: MessageEvent) => void
type ErrorHandler = (error: Event) => void
type OpenHandler = () => void
type CloseHandler = () => void

interface UseWebSocketOptions {
	url: string
	onMessage?: MessageHandler
	onError?: ErrorHandler
	onOpen?: OpenHandler
	onClose?: CloseHandler
}

export const useWebSocket = ({
	url,
	onMessage,
	onError,
	onOpen,
	onClose,
}: UseWebSocketOptions) => {
	const socketRef = useRef<WebSocket | null>(null)

	useEffect(() => {
		const socket = new WebSocket(url)
		socketRef.current = socket

		if (onOpen) socket.onopen = onOpen
		if (onMessage) socket.onmessage = onMessage
		if (onError) socket.onerror = onError
		if (onClose) socket.onclose = onClose

		return () => {
			if (socketRef.current?.readyState === WebSocket.OPEN) {
				socketRef.current.close()
			}
		}
	}, [url, onOpen, onMessage, onError, onClose])

	const send = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
		if (socketRef.current?.readyState === WebSocket.OPEN) {
			socketRef.current.send(data)
		}
	}

	const getSocket = () => socketRef.current

	return { send, socket: getSocket() }
}
