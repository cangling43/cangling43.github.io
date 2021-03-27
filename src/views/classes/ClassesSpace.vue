<template>
  <div class="classesSpace">
    <div class="classesInfo">
      <h2>C{{ classesData.classesId }}&nbsp;&nbsp; {{ classesData.classesName }} </h2>
      <div class="details">
        <ul>
        <li class="item">
          创建时间 : {{ classesData.createDate }}
        </li>
        <li class="item">
          创建者 : {{ classesData.creatorName }}
        </li>
        <li class="item">
          班级人数 : {{ classesData.peopleNum }} 人
        </li>
        <li class="item joinWay">
          允许加入方式 : {{ classesData.joinway | joinWay(that) }}
        </li>
      </ul>
      <span class="title" @click="isopenIntroduction=!isopenIntroduction">
        班级简介 :{{ classesData.introduction }}
      </span>
      </div>

    </div>

    

    <span class="editClasses" @click="editClasses">{{!isEditClasses?"修改班级信息":"保存修改"}}<i class="el-icon-edit"></i></span>

    <el-divider></el-divider>
    <div class="tab-classes">
      <span :class="tab_classes=='test_list'?'active':''" @click="tab_classes='test_list'">班级考试</span>
      <span :class="tab_classes=='user_list'?'active':''" @click="getClassesMembers()">其他班级成员</span>
    </div>
    <!-- 班级考试信息表格 -->
    <div class="test_list table" v-if="tab_classes=='test_list'">
      <el-table :data="TestData" style="width: 100%">
        <el-table-column  label="考试编号" width="110">
          <template slot-scope="scope">E{{scope.row.examId}} </template>
        </el-table-column>
        <el-table-column prop="examName" label="考试名称"> </el-table-column>
        <el-table-column label="考试时间" width="350">
          <template slot-scope="scope">{{scope.row.startDate}} 至 {{scope.row.deadline}}</template>
        </el-table-column>
        <el-table-column label="答题时间" width="100">
          <template slot-scope="scope">{{scope.row.time}} 分钟</template>
        </el-table-column>
        <el-table-column label="总分" width="100">
          <template slot-scope="scope">{{scope.row.totalScore}} 分</template>
        </el-table-column>
        <el-table-column label="是否公布答案" width="120" v-if="$role('teacher')">
          <template slot-scope="scope">{{scope.row.publishAnswer == 1? '是':'否'}}</template>
        </el-table-column>
        <el-table-column label="是否公布分数" width="120" v-if="$role('teacher')">
          <template slot-scope="scope">{{scope.row.publishScore == 1? '是':'否'}}</template>
        </el-table-column>
        <el-table-column prop="grade"  label="分数" width="100" v-if="$role('student')"> </el-table-column>
        <el-table-column prop="status" label="状态" width="80"> </el-table-column>
        <el-table-column prop="operate" label="操作" :width="$role('teacher')?'300':'150'">
          <template slot-scope="scope">
            <div v-if="$role('teacher')">
              <el-button type="primary" size="small" @click="testSituation(scope.row.examId)" plain>查看考试情况</el-button>
              <el-button type="info" size="small" @click="changeTestDate(scope.row)" plain>设置</el-button>
              <el-button type="danger" size="small" @click="cancelRelease(scope.row.examId)" plain>取消发布</el-button>
            </div>
            <div v-if="$role('student')">
              <el-button type="primary" size="small" v-if="scope.row.status!='未开始'" @click="openTestPaper(scope.row)" plain>
                {{scope.row.status=='进行中'? '开始考试':''}}
                {{scope.row.status=='已结束'? '查看试卷':''}}
                {{scope.row.status=='答题完毕'? '查看试卷':''}}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 其他班级成员表格 -->
    <div class="user_list table" v-if="tab_classes=='user_list'">
      <el-table :data="userData" style="width: 100%">
        <el-table-column  label="用户id">
          <template slot-scope="scope">U{{scope.row.userId}} </template> </el-table-column>
        <el-table-column prop="userName" label="成员名称"> </el-table-column>
        <el-table-column  label="加入时间">
          <template slot-scope="scope">{{scope.row.enterDate}} </template> </el-table-column> 
        <el-table-column  label="身份">
           <template slot-scope="scope">{{scope.row.position}} </template> </el-table-column> 
        <el-table-column prop="operate" label="操作" width="300">
          <template slot-scope="scope" v-if="tab_classes=='user_list'">
            <el-button type="primary" size="small" @click="openPaper(scope.row.classesId, scope.row.classes.name)" plain>查看该学生的考试记录</el-button>
            <el-button type="danger" size="small" @click="outUser(scope.row.userId)" plain>踢出班级</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 更改考试时间弹框 -->
    <el-dialog class="releaseTest" title="设置考试发布信息" :visible.sync="changeTestDateDialog" width="40%" @close="releaseTestDate = ''">

      <!-- 选择考试时间 -->
      <el-date-picker v-model="releaseTestDate" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
      <el-switch
        v-model="updateRelease.publishAnswer"
        active-text="公布答案" :active-value="1"
        inactive-text="不公布答案" :inactive-value="0">
      </el-switch>
      <el-switch
        v-model="updateRelease.publishScore"
        active-text="公布分数" :active-value="1"
        inactive-text="不公布分数" :inactive-value="0">
      </el-switch>

      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="lastStep()"> 取消 </el-button>
        <el-button type="primary" size="medium" @click="doChangeTestDate()"> 确认更改 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/less/main/classesSpace.less";
import {getFormatDate} from '@/utils/common.js';

export default {
  name: "ClassesSpace",
  data() {
    return {
      Classes_id: "班级不存在",

      //用户当前身份
      user_status: "student",

      //当前班级数据
      classesData: {},

      //是否打开班级简介
      isopenIntroduction: false,

      //是否为修改班级信息状态
      isEditClasses: false,
      //修改班级信息的数据
      editClassesData: {
        name: "",
        joinWay: "all",
        introduction: "",
      },

      //
      tab_classes: "test_list",

      //试卷信息数据
      TestData: [],

      //班级其他成员数据
      userData: [],

      //更改考试时间弹框
      changeTestDateDialog: false,

      //更改的考试时间
      releaseTestDate: [],

      updateRelease: {},

      that: this,
      
    };
  },
  filters:{
    joinWay(val,that){
      let item = that.$store.state.joinWayType.find(item => item.key = val)
      return item ? item.value : val
    }
  },
  created() {
    // console.log(this.$route.params.id);
    this.Classes_id = this.$route.params.id;
    // this.user_id=this.$root.user_id
    this.user_id = localStorage.getItem("user_id");
    this.user_status = localStorage.getItem("user_status");
    this.getClassesData();
    this.getClassesTestPaper();
  },

  methods: {
    //打开新页面
    goNewRouter(name) {
      const { href } = this.$router.resolve(name);
      console.log(href);
      window.open("/#/test", "_blank");
    },

    //获取班级信息
    getClassesData() {
      let params = {
        classesId: this.$route.params.id
      }
      this.$http.get('/queryClasses',{params}).then(res =>{
        this.classesData = res.data;
      })
    },

    //获取班级成员信息
    getClassesMembers() {
      this.tab_classes='user_list';
      let params = {
        c_id: this.$route.params.id,
      }
      this.$http.get("/queryUserByC_id",{params}).then(res =>{
        if (res.code == 200) {
            //去除创建人的数据
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].position == "创建者") {
                res.data.splice(i, 1);
                break;
              }
            }
            this.userData = res.data;
        }
      })

    },

    //获取班级试卷信息
    getClassesTestPaper() {
      let params = {
        classesId: this.$route.params.id,
      }
      this.$http.get('/getExamByClasses',{params}).then(res =>{
        if (res.code == 200) {
            var data = res.data;
            //处理数据
            for (let i = 0; i < data.length; i++) {
              //判断是否已答题完毕
              if (data[i].examStatus == 1) {

                //判断是否公开成绩
                if (data[i].publishScore == 1) {
                  data[i].grade +=  "分";
                } else {
                  data[i].grade = "--";
                }

                data[i].status = "答题完毕";
              } else {
                data[i].status = "进行中";
                data[i].grade = "--";
              }

              //判断考试是否结束
              var nowDate = new Date().getTime();
              var deadlineTime = new Date(data[i].deadline).getTime();
              var startDateTime = new Date(data[i].startDate).getTime();
              if (nowDate > deadlineTime) {
                data[i].status = "已结束";
              }
              if (nowDate < startDateTime) {
                data[i].status = "未开始";
              }
            }

            this.TestData = res.data;
        }
      })

      
    },

    //修改班级信息
    editClasses() {
      this.isopenIntroduction = true;
      if (this.isEditClasses) {
        var classes = this.classesData.classes;
        //判断用户是否改变数据
        if (
          this.editClassesData.name == classes.name &&
          this.editClassesData.joinWay == classes.joinWay &&
          this.editClassesData.introduction == classes.introduction
        ) {
          console.log("数据没有改变");
        } else {
          //处理班级加入方式
          var joinWay = "";
          if (this.editClassesData.joinWay == "允许任何人加入") {
            joinWay = "all";
          }
          if (this.editClassesData.joinWay == "需要管理员同意申请") {
            joinWay = "apply";
          }
          if (this.editClassesData.joinWay == "不允许任何人加入") {
            joinWay = "no";
          }

          // 处理post请求参数
          var request = {
            token: localStorage.getItem("_token"),
            c_id: classes.c_id,
            name: this.editClassesData.name,
            joinWay: joinWay,
            introduction: this.editClassesData.introduction,
            people_num: classes.people_num,
          };
          request = this.$qs.stringify(request);

          //修改班级信息
          this.$axios({
            method: "post",
            url: "/updateClasses",
            data: request,
          })
            .then((result) => {
              console.log("register -> result", result);
              if (result.data.code == 200) {
                this.$message.success("修改成功!");
                this.getClassesData();
              } else {
                this.$message(result.data.msg);
              }
            })
            .catch((err) => {
              console.log("err ==> ", err);
              this.$message(result.data.msg);
            });
        }
      }

      this.isEditClasses = !this.isEditClasses;
    },

    //把学生踢出班级
    outUser(u_id) {
      this.$confirm(" 这将会删除他所有与班级有关的信息", "是否确定删除学生?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          // 处理post请求参数
          var params = {
            u_id: u_id,
            c_id: this.classesData.classesId,
          };
          this.$http.delete('/outClassesByTeacher',{params}).then(res =>{
            if (res.code == 200) {
                this.$message({ message: "删除学生成功", type: "success" });
                this.getClassesMembers();
              }
          })
        })
        .catch(() => {});
    },

    //更改考试时间弹框
    changeTestDate(val) {
      this.changeTestDateDialog = true;
      this.updateRelease = val;
      this.releaseTestDate = [val.startDate,val.deadline]
      console.log(val);
    },

    //更改考试时间数据库操作
    doChangeTestDate() {
      //考试开始时间
      var start_date = getFormatDate(new Date(this.releaseTestDate[0]));
      //考试结束时间
      var deadline = getFormatDate(new Date(this.releaseTestDate[1]));

      // 处理post请求参数
      var request = {
        examId: this.updateRelease.examId,
        classesId: this.classesData.classesId,
        startDate: start_date,
        deadline,
        publishScore: this.updateRelease.publishScore,
        publishAnswer: this.updateRelease.publishAnswer
      };
      this.$http.post('/updateReleaseTest',request).then(res =>{
          if (res.code == 200) {
            this.getClassesTestPaper();
            this.changeTestDateDialog = false;
            this.$message.success("更改成功");
          }
      })
    },

    // 查看考试情况
    testSituation(tp_id) {
      this.$router.push({
        path: "/main/classes/testSituation",
        query: { cId: this.Classes_id, tpId: tp_id },
      });
    },

    // 取消发布
    cancelRelease(tp_id) {
      this.$confirm("此操作将删除试卷在该班级的所有信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          var params = {
            tp_id,
            c_id: this.classesData.classesId,
          };
          this.$http.delete('/cancelRelease',{params}).then(res =>{
              if (res.code == 200) {
                this.getClassesTestPaper();
                this.$message.success("已取消发布");
              }
          })
          
        })
        .catch(() => {});
    },

    //开始考试
    openTestPaper(val) {
      var { href } = this.$router.resolve({
        name: "TestPaperStu",
        params: {
          tp_id: val.examId,
          c_id: this.classesData.classesId,

        },
      });
      window.open(href, "_blank");
    },
  },

  watch: {
    //监听params参数的变化
    $route: {
      handler() {
        this.Classes_id = this.$route.params.id;
        this.getClassesData();
      },
      deep: true,
    },
  },
};
</script>
