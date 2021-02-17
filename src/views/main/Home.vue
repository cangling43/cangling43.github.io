<template>
  <div class="content-bg">
      <div class="tab-title">
        <div class="tabTitle-item active">首页</div>
      </div>

      <div class="tab-item">
        <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->

        <div class="home">
          
          <div class="enterClasses">
            <el-form :inline="true">
            <el-form-item label="搜索班级">
              <el-input v-model="enterClasses_id" placeholder="请输入班级编号" ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="joinClasses()">查询</el-button>
            </el-form-item>
          </el-form>
          </div>

          <div class="myTopic">
            <el-button >我收藏的题库</el-button>
          </div>

          <div class="findTopic">
            <el-button >寻找题库</el-button>
          </div>

          <div class="findTopic">
            <el-button >个人资料</el-button>
          </div>

        </div>

      </div>
  </div>  
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import "../../assets/less/my_tab.less"
import "../../assets/less/main/home.less"

export default {
  name: "Home",
  
  // components: {
  //   HelloWorld,
  // },
  data(){
        return{
            enterClasses_id:'',


        }
    },
    created(){
        
        
    },
    watch:{
        
    }
};
</script>
