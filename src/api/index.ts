import axios from 'axios'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

export * from './ai/video.api'
