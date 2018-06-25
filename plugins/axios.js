/*
 * @Description: 重写axios二次封装
 * @Author: LiuZhen
 * @Date: 2018-06-03 11:12:08
 * @Last Modified by: cb
 * @Last Modified time: 2018-06-21 14:55:24
 */
import axios from 'axios'
import { handleRequestParams } from '@/utils/utils'
import { WEBSTORAGE_TOKEN_NAME } from '@/config/config'
import store from '../store'

const Axios = axios.create({
  timeout: 15000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  }
})

// http request请求拦截器(所有请求发送都要执行的操作)
Axios.interceptors.request.use(
  config => {
    // 根据环境设置baseURL
    if (process.env.__ENV === 'production') {
      config.baseURL = 'https://www.kg.com/kgapi/'
    } else if (process.env.__ENV === 'test') {
      config.baseURL = 'https://t.kg.com/kgapi/'
    } else {
      config.baseURL = 'https://dev.kg.com/'
    }

    // 参数序列化
    if (config.method === 'post') {
      let token = store().state.KGUser && store().state.KGUser.token ? store().state.KGUser.token : ''
      config.data = handleRequestParams(config.data, token)
    }
    return config
  }, error => {
    return Promise.reject(error)
  }
)

// http response响应拦截器
Axios.interceptors.response.use(
  response => {
    // 判断返回code是否为10004，token失效状态，若是则清除Node服务器session中的token
    if (response.data.code === '10004') {
      // store().dispatch('userLogout')
    }
    if (response.data.code === '10011') {
      store().dispatch('userLogout')
    }
    return response
  }, error => {
    return Promise.reject(error)
  }
)

export default Axios
