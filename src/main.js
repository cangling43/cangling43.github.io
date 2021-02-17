import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import axios from 'axios';
import Qs from 'qs';

Vue.use(ElementUI);
Vue.prototype.$axios = axios
Vue.prototype.$qs = Qs;


//配置请求基础路径
axios.defaults.baseURL = 'http://localhost:8080';
// axios.defaults.baseURL = 'http://192.168.83.50:8080';


//axios拦截器，在发起请求之前执行
axios.interceptors.request.use(config => {

  // //处理post请求参数, 进行参数序列化
  // if (config.method == 'post') {
  //   console.log('config', config);

  //   //序列化post请求参数
  //   let paramsString = '';
  //   for (let key in config.data) {
  //     if(typeof(config.data[key])=='object'){
        
  //     }
  //     paramsString += `${key}=${config.data[key]}&`;
  //   }

  //   //重新赋值config.data
  //   config.data = paramsString.slice(0, -1);

  // }
  console.log('config', config);

  // //必须返回config
  return config;
})


//axios拦截器，在请求返回时执行
axios.interceptors.response.use(config => {
  //token认证失败,重新登录
  if(config.data.code==300){
    router.push("/Login")
    ElementUI.Message("请重新登录")
  }

  //必须返回config
  return config;
})

//修改页面标题
router.beforeEach((to, from, next)=>{
  if(to.meta.title){
    document.title = to.meta.title
  }
  next()
})



//获取系统时间
Vue.prototype.getNowFormatDate = function(format) {
  //创建日期对象
  let date = new Date();

  //格式化年份
  let year = date.getFullYear().toString();
  // 
  if (/(y+)/.test(format)){
    //获取匹配组的内容
    var content = RegExp.$1;
    // 
    format = format.replace(content, year.slice(year.length - content.length));
  }

  // 

  //格式化月份、日份、时、分、秒
  let o = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };

  // 

  for (let key in o) {
    //创建动态正则表达式
    let reg = new RegExp(`(${key}+)`);
    // 

    if (reg.test(format)) {
      //获取组匹配的内容
      let groupContent = RegExp.$1;
      // 

      format = format.replace(groupContent, o[key] >= 10 ? o[key] : groupContent.length == 2 ? '0' + o[key] : o[key]);
      // 
    }
    
  }

  return format;
};

//获取格式化时间时间
Vue.prototype.getFormatDate = function(date) {
  var format='yyyy-MM-dd hh:mm:ss';

  //格式化年份
  let year = date.getFullYear().toString();
  // 
  if (/(y+)/.test(format)){
    //获取匹配组的内容
    var content = RegExp.$1;
    // 
    format = format.replace(content, year.slice(year.length - content.length));
  }

  // 

  //格式化月份、日份、时、分、秒
  let o = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };

  // 

  for (let key in o) {
    //创建动态正则表达式
    let reg = new RegExp(`(${key}+)`);
    // 

    if (reg.test(format)) {
      //获取组匹配的内容
      let groupContent = RegExp.$1;
      // 

      format = format.replace(groupContent, o[key] >= 10 ? o[key] : groupContent.length == 2 ? '0' + o[key] : o[key]);
      // 
    }
    
  }

  return format;
};

//全局前置守卫 
router.beforeEach((to, from, next) => {
  if(to.name=="Login"||to.name=="Register"){
    next()
  }else{
    var token=localStorage.getItem("_token");
    if(!token){
      ElementUI.Message("请先登录")
      next("/login")
    }else{
      next();
    }
  }
  
})





Vue.config.productionTip = false;

new Vue({
  router,
  store,
  
  render: h => h(App)
}).$mount('#app')
