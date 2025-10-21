import axios from 'axios'


const API = axios.create({
baseURL: import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api',
withCredentials: false,
})


export default API