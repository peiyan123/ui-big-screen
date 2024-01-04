import Axios from 'axios'
import { useUserStoreWithOut  } from '@/store/moudules/appStore'
import  router  from "../router"
const baseURL = '/api'
const userStore = useUserStoreWithOut()
const axios = Axios.create({
  baseURL,
  timeout: 20000 // 请求超时 20s
})
// 前置拦截器（发起请求之前的拦截）
axios.interceptors.request.use(
  (response: any) => {
    /**
     * 根据你的项目实际情况来对 config 做处理
     * 这里对 config 不做任何处理，直接返回
     */
     userStore.token ? response.headers['X-Authorization'] = 'Bearer ' + localStorage.getItem('token') : '';
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 后置拦截器（获取到响应时的拦截）
axios.interceptors.response.use(
  (response) => {
    /**
     * 根据你的项目实际情况来对 response 和 error 做处理
     * 这里对 response 和 error 不做任何处理，直接返回
     */
    return response
  },
  (error) => {
    let msg 
    if (error.response.status === 401) {
      userStore.removeToken
      localStorage.removeItem('token')
      router.push('/login' );
    }
    if (error.response && error.response.data) {
      // const code = error.response.status
      msg = error.response.data.message
      // ElNotification.error(`Code: ${code}, Message: ${msg}`)
      // ElNotification({title: 'error', type: 'error', message: msg })
      //console.error(`[Axios Error]`, msg)
    } else {
      // ElNotification({title: 'error', type: 'error', message: error })
      // ElNotification.error(`${error}`)
    }
    return Promise.reject(msg)
  }
)
// 封装post方法
export function post (url: any, data: Object = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch(err => {
        reject(err)
      })
  })
}
// 封装get方法
export function get (url: any, params: Object = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default axios
