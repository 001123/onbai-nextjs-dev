import axios, { AxiosInstance } from 'axios'
import Router from 'next/router'
import toast from 'react-hot-toast'
import { PAGES } from './constant'
import useSWR, { useSWRInfinite } from 'swr'

/**
 * Feathers.js apis
 * docs: https://docs.feathersjs.com/api/client/rest.html#jquery
 */
const API: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

function showLoading() {
  hideLoading()
  const loadContent = document.createElement('div')
  loadContent.className = 'onbai-loading-full'
  loadContent.innerHTML = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45"/>
    </svg>
    `
  document.body.appendChild(loadContent)
}
function hideLoading() {
  const listLoading = document.querySelectorAll('.onbai-loading-full')
  listLoading.forEach((e) => e.remove())
}

const onLogout = () => {
  localStorage.removeItem('token')
  Router.replace(PAGES.NOT_LOGIN)
}

// Add a request interceptor
API.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    showLoading()
    config.headers.Authorization =
      'Bearer ' + (process.browser && localStorage.getItem('token'))

    return config
  },
  function (error) {
    // Do something with request error
    hideLoading()
    return Promise.reject(error)
  }
)

// Add a response interceptor
API.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    hideLoading()
    return response
  },
  function (error) {
    hideLoading()
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // TODO: refactor check auth
    if (
      error?.response?.status === 401 &&
      error?.response?.data?.message !== 'Invalid login'
    ) {
      onLogout()
    } else {
      toast.error(error?.response?.data?.message || error.message)
    }
    console.error(error.response)

    return Promise.reject(error)
  }
)

/**
 * Next.js apis
 */
const NEXTJS_API: AxiosInstance = axios.create({
  baseURL: '/',
})
// Add a request interceptor
NEXTJS_API.interceptors.request.use(
  function (config) {
    showLoading()
    return config
  },
  function (error) {
    hideLoading()
    return Promise.reject(error)
  }
)

// Add a response interceptor
NEXTJS_API.interceptors.response.use(
  function (response) {
    hideLoading()
    return response
  },
  function (error) {
    hideLoading()
    console.error(error.response)
  }
)

// Hook SWR

const fetcher = (url) => API.get(url).then((res) => res.data)

const getData = (url: string) => {
  const { data, error } = useSWR(url, fetcher, {
    shouldRetryOnError: false,
  })

  return {
    data,
    error,
    isLoading: !error && !data,
  }
}

export { API, NEXTJS_API, getData }
