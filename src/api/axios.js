import axios from 'axios';
import ElementUI from 'element-ui';
import router from '../router'
import Vue from 'vue'

const baseURL = 'http://localhost:8761'
Vue.prototype.$imageBaseUrl = baseURL+'/images/';
Vue.prototype.$baseURL = baseURL;

const service = axios.create({
  baseURL: baseURL,
  timeout: 5000
})

service.interceptors.request.use(
  config => {
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
    return config;
  },
  error => {
    // 确保在请求拦截器中返回一个 rejected promise
    return Promise.reject(error);
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data;
    console.log(res);
    if (res && res.code === 200) {
      return res;
    }

    if (res && res.code === 300) {
      router.push("/Login")
      ElementUI.Message("登录已失效,请重新登录")
    } else {
      ElementUI.Message(res.msg)
    }
    return Promise.reject(res);
  },
  error => {
    let data = error.response.data;
    return Promise.reject(data);
  }
)


export default service