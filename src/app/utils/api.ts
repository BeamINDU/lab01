import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor (optional: ใช้สำหรับเพิ่ม token หรือจับ error global)
instance.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token') // (ถ้าใช้)
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // error sweetalert or toast
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res: AxiosResponse<T> = await instance.get(url, config)
    return res.data
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const res: AxiosResponse<T> = await instance.post(url, data, config)
    return res.data
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const res: AxiosResponse<T> = await instance.put(url, data, config)
    return res.data
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res: AxiosResponse<T> = await instance.delete(url, config)
    return res.data
  },
}
