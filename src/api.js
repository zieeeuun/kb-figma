import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://ai-lovable-1.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
})
