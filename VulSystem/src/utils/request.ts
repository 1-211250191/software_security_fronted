import axios from 'axios'
import querystring from 'querystring'

const errorHandle = (status: number, info: string) => {
  switch (status) {
    case 400:
      console.log('语义有误')
      break
    case 401:
      console.log('服务器认证失败')
      break
    case 403:
      console.log('服务器拒绝访问')
      break
    case 404:
      console.log('地址错误')
      break
    case 500:
      console.log('服务器遇到意外')
      break
    case 502:
      console.log('服务器无响应')
      break
    default:
      console.log(info)
      break
  }
}

// 1.创建网络请求对象
const instance = axios.create({
  // 这里放网络请求的公共配置
  timeout: 5000,
  baseURL: 'http://localhost:8080', // 服务器地址，上线后需要修改
})

// 拦截器----发送数据之前
instance.interceptors.request.use(
  (config) => {
    // 拦截器成功函数

    if (config.method == 'post') {
      config.data = querystring.stringify(config.data)
    }

    // config:包含着网络请求的所有信息
    return config
  },
  (error) => {
    // 拦截器失败函数

    // 返回错误信息
    return Promise.reject(error)
  },
)

// 拦截器----获取数据之前
instance.interceptors.response.use(
  (response) => {
    // 拦截器成功函数
    return response.status == 200 ? Promise.resolve(response) : Promise.reject(response)
  },
  (error) => {
    // 拦截器失败函数
    const { response } = error
    errorHandle(response.status, response.info)
  },
)

//2.导出网络请求对象
export default instance
