import axios from 'axios'

// create an axios instance
const request = axios.create({
  baseURL: '/server', 
  timeout: 5000 ,
  withCredentials: true,
})

// request interceptor
request.interceptors.request.use((config => config),(error) => { 
  return Promise.reject(error)
})

// response interceptor
request.interceptors.response.use((response => response),(error) => { return Promise.reject(error) })

export default request

