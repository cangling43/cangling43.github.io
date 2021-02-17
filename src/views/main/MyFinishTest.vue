<template>
  <div class="FinishTest">
    <TopTab title="我考过的试卷">
      <div class="tab-content">

        <div class="class-list">
          <div class="class-box" >
            <div class="title" @click="toggleClassBox()" >
              <div class="classNo">C00001</div>
              <div class="className">班级名称</div>
              <div class="title-but">
                <el-button type="primary" size="small" plain>进入班级</el-button>
                <el-button type="danger" size="small" plain>退出班级</el-button>
              </div>
            </div>
            <div class="info" >
              <div class="info-item">加入时间 : 2021-01-05 21:53:16</div>
              <div class="info-item">班级人数 : 52 人</div>
              <div class="info-item">加入限制 : 允许任何人加入</div>
              <div class="info-item">创建者 : admin</div>
              <div class="info-item">班级简介 : <p>admin允许任何人加入允许任何人加入允许任何人加入允许任何人加入允许任何人加入允许任何人加入允许任何人加入</p></div>
            </div>
            
          </div>

        </div>
      </div>
    </TopTab>
  </div>
</template>

<script>
import TopTab from "../../components/TopTab.vue";
import "../../assets/less/main/finishTest.less";
export default {
  name: "MyFinishTest",
  components: {
    TopTab,
  },
  data() {
    return {
      test_id: "",

      toggle: true,
    };
  },
  created() {
    // this.asideIsSpread=false
    this.test_id = this.$route.params.test_id;
    // console.log(this.$route.params);
  },

  watch: {},

  methods:{
    toggleClassBox(){
      console.log(111);
      this.toggle = !this.toggle;



      this.test ={
        a: 'a',
        b: 'b'
      }

      if(/abc/.test(this.username)){
        //...
      }
    }
  }
};
</script>

