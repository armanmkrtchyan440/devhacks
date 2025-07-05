import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

export const useSendVideoToAi = () => {
	return useMutation({
		mutationFn: (video: Blob) => {
			const formData = new FormData()
			formData.set('file', video)

			return axios.post('/transcribe', formData)
		},
	})
}
