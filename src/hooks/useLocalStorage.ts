export const useLocalStorage = <T = unknown>(key: string) => {
	const setItem = (value: T): void => {
		try {
			window.localStorage.setItem(key, JSON.stringify(value))
		} catch (error) {
			console.log((error as Error)?.message)
		}
	}

	const getItem = (): T | undefined => {
		try {
			const item = window.localStorage.getItem(key)
			return item ? (JSON.parse(item) as T) : undefined
		} catch (error) {
			console.log((error as Error)?.message)
			return undefined
		}
	}

	const removeItem = (): void => {
		try {
			window.localStorage.removeItem(key)
		} catch (error) {
			console.log((error as Error)?.message)
		}
	}

	return { setItem, getItem, removeItem }
}
