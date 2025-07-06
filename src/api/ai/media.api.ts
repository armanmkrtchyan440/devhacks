import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

interface SendMediaResponse {
	audio_url: string
	bot_answer: string
	speech_file_path: string
	success: boolean
	text: string
}

export const useSendMediaToAi = () => {
	return useMutation({
		mutationFn: async (video: Blob) => {
			const formData = new FormData()
			formData.set('file', video)
			const { data } = await axios.post<SendMediaResponse>(
				'/transcribe',
				formData
			)
			return data
		},
	})
}
