import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import http from './api/axios'

import api from '@/utils/api.js'
import {formatSeconds} from '@/utils/common'
import {role} from '@/utils/role'

Vue.use(ElementUI);

Vue.prototype.$http = http;
Vue.prototype.$role = role;
Vue.prototype.$api = api;

Vue.filter('formatSeconds',formatSeconds)

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
      //获得权限
      store.dispatch('getRole')
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
