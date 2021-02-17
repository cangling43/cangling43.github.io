<template>
  <div class="main">
    <div class="header">
      <div class="logo" @click="goRouter('/main/home','Home')">考试汇</div>
      <div class="person" >
        <div class="img"><img src="" alt=""></div>
        <div class="name">{{userName}}</div>
        <div class="dropdown" >
          <div class="item">个人中心</div>
          <div class="item">我的消息</div>
          <div class="item" @click="loginOut">退出登录</div>
        </div>
      </div>
      
    </div>

    <div class="main">
      <div  class="aside" ref="aside" >
        <div class="menu"  @mouseenter="menuEnter" @mouseleave="menuOut">
          <div class="menu-item" v-for="(item ,index) in menu" :key="index" ref="menu_item" @click="goRouter(item.path,item.name)" :class="activeName==item.name ? 'active':''">
            <i :class="item.i" ></i>  
            <span v-if="isSpread||isMenuHover">{{item.title}}</span> 
          </div>

        </div>
        <div class="spread">
          <i  :class="isSpread? 'el-icon-download isPackup':'el-icon-upload2 isSpread'" @click="spread"></i>
        </div>
        
      </div>


      <div class="main-content" ref="content">
        <router-view />
      </div>


    </div>
  </div>
</template>

<script>
import "../assets/font/iconfont.css"
import "../assets/less/main.less"
export default {
  name: "Main",

  data() {
    return {
      activeName: "Home",

      userName: '未登录',//用户名称

      userData:[],//用户数据

      menu:[],//侧导航栏数据

      isSpread:true,//侧栏是否为展开状态

      isMenuHover:false,//鼠标是否移入侧栏

    };
  },

  created(){
    var user_status=localStorage.getItem("user_status");
    if(user_status=="teacher"){
      this.menu=[
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
          i:"el-icon-edit-outline",
          title:"我考过的试卷",
          path:"/main/myFinishTest",
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
        }
      ];
    }else if(user_status=="student"){
      this.menu=[
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
        {
          i:"iconfont icon-laoshi",
          title:"变更为教师身份",
          path:"/main/changeStatus",
          name:"ChangeStatus"
        }
      ];
    }else{
      this.$router.push("/Login")
    }
    
    //渲染侧导航栏
    for (let i = 0; i < this.menu.length; i++) {
      if( this.menu[i].name.indexOf(this.$route.name) > -1){
        this.activeName= this.menu[i].name;
        break;
      }
    }

    this.userName = localStorage.getItem("user_name")
    // console.log(this.$route);

  },

  mounted(){
    this.spread()
  },


  methods: {
    //路由跳转
    goRouter(path,name){
      if(this.activeName==name){
        return
      }
      this.activeName=name
      this.$router.push(path)

    },

   

    //退出登录
    loginOut(){
      localStorage.removeItem("_token")
      localStorage.removeItem("user_status")
      localStorage.removeItem("user_name")
      sessionStorage.removeItem("openClassesSpace")

      this.$router.push({name:"Login"})
    },

    /* 侧栏收起与展开事件 start*/
    spread(){
      if(this.isSpread){
        this.packupStyle();
      }else{
        this.spreadStyle();

      }
      this.isSpread=!this.isSpread;
      
    },
    spreadStyle(){
      this.$refs.aside.style.width="200px";
      this.$refs.menu_item.map(v =>{
        v.style.paddingLeft="20px"
      })
      this.$refs.content.style.width="calc(100% - 200px)"
    },
    packupStyle(){
      this.$refs.aside.style.width="44px";
      this.$refs.menu_item.map(v =>{
        v.style.paddingLeft="10px"
      })
      this.$refs.content.style.width="calc(100% - 44px)"
    },
    menuEnter(){
      if(this.isSpread){
        return
      }
      this.isMenuHover=true;
      this.$refs.aside.style.width="200px"
    },
    menuOut(){
      if(this.isSpread){
        return
      }
      this.isMenuHover=false;
      if(this.isSpread==false&&this.isMenuHover==false){
        this.$refs.aside.style.width="44px"
      }
    },
    /* 侧栏收起与展开事件  end */
    



  },

 
};
</script>
