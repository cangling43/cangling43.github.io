import axios from 'axios';
import ElementUI from 'element-ui';
import router from '../router'

const service = axios.create({
  baseURL: 'http://localhost:8082',
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    // 上传文件时，config.data的数据类型是FormData，
    // qs.stringify(FormData)的结果是空字符串，导致接口报**参数为空**的错误
    if (config.method === 'post' && config.data.constructor !== FormData) {
      config.headers['Content-Type'] = "application/json";
      config.data = JSON.stringify(config.data)
    }
    if (config.method === 'put') {
      config.headers['Content-Type'] = "application/json";
      config.data = JSON.stringify(config.data)
    }
    config.headers['token'] = localStorage.getItem('_token');

    console.log(config);
    return config
  },
  error => {
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data;
    console.log(res);
    //请求成功
    if(res.code == 200){
      return res;
    }

    //token认证失败,重新登录
    if(res.code==300){
      router.push("/Login")
      ElementUI.Message("登录已失效,请重新登录")
    }else{
      // 其他报错
      ElementUI.Message(res.msg)
    }
    return res;
    
  },
  error => {
    let data = error.response.data
    // Message({
    //   message: data.msg,
    //   type: 'error',
    //   duration: 3 * 1000
    // })
    return Promise.reject(data)
  }
)

export default service