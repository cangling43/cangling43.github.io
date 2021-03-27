<template>
  <div class="testSituation">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/main/classes/classesList' }">我的班级</el-breadcrumb-item>
      <el-breadcrumb-item><a @click="$router.go(-1)">{{releaseInfo.classesName}}</a></el-breadcrumb-item>
      <el-breadcrumb-item>{{releaseInfo.examName}}</el-breadcrumb-item>
      <el-breadcrumb-item>查看考试情况</el-breadcrumb-item>
    </el-breadcrumb>

		    <!-- 其他班级成员表格 -->
    <div class="user_list table" >
      <el-table :data="userGradeList" style="width: 100%">
        <el-table-column  label="用户id"> 
          <template slot-scope="scope">U{{scope.row.userId}} </template>
        </el-table-column>
        <el-table-column prop="userName" label="成员名称"> </el-table-column>
        <el-table-column prop="answerDate" label="答题日期" width="184"> </el-table-column>
        <el-table-column prop="answerTime" label="答题用时">
          <template slot-scope="scope">{{scope.row.answerTime | formatSeconds}} </template> </el-table-column>
        <el-table-column  label="答题状态"> 
          <template slot-scope="scope">{{scope.row.examStatus == 1? '已完成':'未完成'}} </template>
        </el-table-column>
        <el-table-column prop="grade" label="得分"> </el-table-column>
        <el-table-column prop="gradeAuto" label="自动评改得分"> </el-table-column>
        <el-table-column  label="批改状态"> 
          <template slot-scope="scope">{{scope.row.markStatus == 1? '批改完成':'待批改'}} </template>
        </el-table-column>
        <el-table-column prop="operate" label="操作" width="300">
					<template slot-scope="scope" >
            <el-button type="primary" size="small" v-if="scope.row.examStatus == 1" @click="openPaper(scope.row.classesId, scope.row.userId,scope.row.examId)" plain>
              {{scope.row.markStatus == 1 ? '查看试卷':'审批试卷'}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {formatSeconds} from '@/utils/common'
export default {
  name: "TestSituation",
	data(){
		return {
      classesId: this.$route.query.cId,
      examId: this.$route.query.tpId,
			userGradeList:[],
      releaseInfo:{},
		}
	},
  created(){
    console.log(this.$route.query);
    this.getUserGradeList()
    this.getReleaseInfo()
    console.log(formatSeconds(112));
  },
  methods:{
    getUserGradeList(){
      let params = {
        classesId: this.classesId,
        examId: this.examId,
      }
      this.$http.get('/getUserGradeList',{params}).then(res =>{
        if(res.code == 200){
          this.userGradeList = res.data
        }
      })
    },
    getReleaseInfo(){
      let params = {
        classesId: this.classesId,
        examId: this.examId,
      }
      this.$http.get('/getReleaseInfo',{params}).then(res =>{
        if(res.code == 200){
          this.releaseInfo = res.data
        }
      })
    },
    openPaper(classesId,userId,examId){
       let { href } = this.$router.resolve({
        path: "/markTestPaper",
        query: { cId: classesId, eId: examId ,uId:userId },
      });
      console.log(href);
      window.open(href, "_blank");
    }
  }

};
</script>

<style lang="less">
.testSituation{
	padding: 24px;

	.el-breadcrumb{
		font-size: 16px;
		padding:0 16px 16px 16px ;
	}
}
</style>