<template>
  <div class="home">
    <TopTab title="首页">
      <div class="tab-content">
        <ul class="home-header">
          <li @click="me">个人资料</li>
          <template v-if="$role('student')">
            <li @click="myClasses">我的班级</li>
            <li @click="finishTest">我参加过的考试</li>
          </template>
          <template v-if="$role('teacher')">
            <li @click="createClasses">创建班级</li>
            <li @click="createExam">创建试卷</li>
            <li @click="myClasses">我的班级</li>
          </template>
        </ul>
      </div>
    </TopTab>


    <!-- 创建班级对话框 -->
    <CreateClasses ref="createClasses" @success="getClasses()" />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import TopTab from "../../components/TopTab.vue";
import "../../assets/less/main/home.less";
import { mapMutations } from "vuex";
import CreateClasses from '@/views/classes/components/CreateClasses.vue'

export default {
  name: "Home",
  components: {TopTab, CreateClasses },
  data() {
    return {
      enterClasses_id: "",
    };
  },
  created() {},
  watch: {},
  methods: {
    ...mapMutations(["setActiveName"]),

    // 个人中心
    me() {
      this.$router.push({
        name: "Me",
      });
      this.setActiveName("Me");
    },
    
    // 我的班级
    myClasses() {
      this.$router.push({
        name: "ClassesList",
      });
      this.setActiveName(["Classes","ClassesList","ClassesSpace"]);
    },

    // 我参加过的考试
    finishTest() {
      this.$router.push({
        name: "MyFinishTest",
      });
      this.setActiveName("MyFinishTest");
    },

    // 创建试卷
    createExam() {
      const { href } = this.$router.resolve({
        name: "createExam",
        params: { type: 'add'}
      });
      window.open(href, "_blank");
    },

    // 创建班级
    createClasses() {
      this.$refs.createClasses.dialog = true  
    },

    
  },
};
</script>
