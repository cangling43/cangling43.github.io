import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api/axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tchNav: [
      {
        i:"el-icon-s-home",
        title:"首页",
        path:"/main/home",
        name:"Home",
      },
      {
        i:"el-icon-s-grid",
        title:"我的班级",
        path:"/main/classes/classesList",
        name:["Classes","ClassesList","ClassesSpace"]
      },
      {
        i:"el-icon-document-copy",
        title:"我的试卷",
        path:"/main/myTest",
        name:"MyTest"
      },
      {
        i:"el-icon-tickets",
        title:"我的题库",
        path:"/main/topic",
        name:"Topic"
      },
      {
        i:"el-icon-document-checked",
        title:"审批试卷",
        path:"/main/myCheckTest",
        name:"MyCheckTest"
      },
      {
        i:"el-icon-message",
        title:"我的消息",
        path:"/main/myMessage/inboxes",
        name:["Inboxes","SendMessage","MyMessage"]
      },
      {
        i:"el-icon-user",
        title:"个人中心",
        path:"/main/me",
        name:"Me"
      },
      // {
      //   i:"iconfont icon-laoshi",
      //   title:"变更为学生身份",
      //   path:"/main/changeStatus",
      //   name:"ChangeStatus"
      // }
    ],
    stuNav: [
      {
        i:"el-icon-s-home",
        title:"首页",
        path:"/main/home",
        name:"Home"
      },
      {
        i:"el-icon-s-grid",
        title:"我的班级",
        path:"/main/classes/classesList",
        name:["Classes","ClassesList","ClassesSpace"]
      },
      {
        i:"el-icon-edit-outline",
        title:"我考过的试卷",
        path:"/main/MyFinishTest",
        name:"MyFinishTest"
      },
      {
        i:"el-icon-message",
        title:"我的消息",
        path:"/main/myMessage/inboxes",
        name:["Inboxes","SendMessage","MyMessage"]
      },
      {
        i:"el-icon-user",
        title:"个人中心",
        path:"/main/me",
        name:"Me"
      },
      // {
      //   i:"iconfont icon-laoshi",
      //   title:"变更为教师身份",
      //   path:"/main/changeStatus",
      //   name:"ChangeStatus"
      // }
    ],
    userName: '',

    userRole: 'student'
  },
  mutations: {
    setUserName(state,data){
      state.userName=data
    },

    setUserRole(state,data){
      state.userRole=data
    },

    asideIsSpread(){
      
    },
    setTestData(state,data){
      state.testData = data
    }

  },
  actions: {
    getRole({commit ,state}){
      api.get("/getUserById",{}).then(res =>{
        commit('setUserRole',res.data.role)
        commit('setUserName',res.data.userName)
      })
    }
  },
  modules: {
  }
})
