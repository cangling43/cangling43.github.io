<template>
  <div class="home">
    <TopTab title="首页">
      <div class="tab-content">
        <div class="home-introduce">
          <div>
            <p>欢迎来到考试汇</p>
            <p>这是一款基于前后端分离的线上考试系统</p>
            <p>前端采用vue框架，搭配vue-cli、axios、vuex、element-ui组件库。后端采用springBoot框架、jwt、swagger、持久层mybatis，mysql数据库。</p>
            <p>在这里你可以切换两种不同的身份，从而使用两种不同的身份</p>
            <p>开始探索吧~</p>
            <p><a href="https://gitee.com/tatata1124">gitbit网站:  https://gitee.com/tatata1124</a></p>
          </div>
        </div>

        <ul class="home-header">
          <li>个人资料</li>
          <li>创建班级</li>
          <li>我的班级</li>
          <li>我的试卷</li>
        </ul>
        <ul class="home-content">
          <li class="myMessage">暂无消息通知</li>
          <li class="more">功能开发中,敬请期待</li>
        </ul>
      </div>
    </TopTab>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import TopTab from "../../components/TopTab.vue";
import "../../assets/less/main/home.less";

export default {
  name: "Home",
  components: {
    TopTab,
  },
  data() {
    return {
      enterClasses_id: "",
    };
  },
  created() {
  },
  watch: {},
  methods: {
    
  },
};
</script>
