<template>
    <div class="classesSpace">
        <div class="classesInfo">
            <div class="title">
                <h2 v-if="!isEditClasses">{{ classesData.classes.name }} </h2>
                <el-input v-else v-model="editClassesData.name" class="classesName" ></el-input>
                <span class="editClasses" @click="editClasses">{{!isEditClasses?"修改班级信息":"保存修改"}}<i class="el-icon-edit"></i></span>
            </div>
            
            <ul>
              <li class="item">
                  <span>班级编号 :</span> {{ classesData.classes.number }}
              </li>
              <li class="item">
                  <span>创建时间 :</span> {{ classesData.classes.create_date }}
              </li>
              <li class="item">
                  <span>创建者 :</span> {{ classesData.user.name }}
              </li>
              <li class="item">
                  <span>班级人数 :</span> {{ classesData.classes.people_num }} 人
              </li>
              <li class="item joinWay">
                  <span >允许加入方式 :</span>
                  <div v-if="!isEditClasses">{{ classesData.classes.joinWay }}</div>        
                  <div v-else class="joinWayRadio">
                      <el-radio v-model="editClassesData.joinWay" label="允许任何人加入"> 允许任何人加入</el-radio>
                      <el-radio v-model="editClassesData.joinWay" label="需要管理员同意申请">需要管理员同意申请</el-radio>
                      <el-radio v-model="editClassesData.joinWay" label="不允许任何人加入">不允许任何人加入</el-radio>
                  </div>
              </li>
            </ul>
            


            <div class="item introduction" >
                <span class="title" @click="isopenIntroduction=!isopenIntroduction">
                  班级简介 : 
                  <i class="el-icon-arrow-down" :class="isopenIntroduction?'active':''"></i>
                </span> 
                <el-collapse-transition>
                  <div v-show="isopenIntroduction">
                    <div class="con" v-if="!isEditClasses">{{ classesData.classes.introduction }}
                    </div>
                    <div class="con" v-else>
                      <el-input
                        type="textarea"
                        :rows="3"
                        v-model="editClassesData.introduction">
                      </el-input>
                    </div>
                  </div>
                </el-collapse-transition>
            </div>
        </div>

        <el-divider></el-divider>
        <div class="tab-classes">
          <span :class="tab_classes=='test_list'?'active':''" @click="tab_classes='test_list'">班级考试</span>
          <span :class="tab_classes=='user_list'?'active':''"  @click="tab_classes='user_list'">其他班级成员</span>
        </div>
        <!-- 班级考试信息表格 -->
        <div class="test_list table" v-if="tab_classes=='test_list'">
          <el-table :data="TestData" style="width: 100%">
            <el-table-column prop="testPaper.number" label="考试编号" width="110"> </el-table-column>
            <el-table-column prop="testPaper.name" label="考试名称" > </el-table-column>
            <el-table-column label="考试时间" width="320">
              <template slot-scope="scope">{{scope.row.start_date}} 至 {{scope.row.deadline}}</template>
            </el-table-column>
            <el-table-column label="答题时间"  width="100">
              <template slot-scope="scope">{{scope.row.testPaper.time}} 分钟</template>
            </el-table-column>
            <el-table-column  label="总分" width="100">
              <template slot-scope="scope">{{scope.row.testPaper.total_score}} 分</template>
            </el-table-column>
            <el-table-column prop="testPaper.userGrade.grade" v-if="user_status=='student'" label="分数"  width="100"> </el-table-column>
            <el-table-column prop="status" label="状态"  width="80"> </el-table-column>
            <el-table-column prop="operate" label="操作" :width="user_status=='teacher'?'320':'150'"> 
              <template slot-scope="scope">
                <div v-if="user_status=='teacher'">
                  <el-button type="primary" size="small" @click="changeTestDate(scope.row.testPaper.tp_id)" plain>更改考试时间</el-button>
                  <el-button type="primary" size="small" @click="editTestPaper(scope.row.testPaper.tp_id)" plain>编辑试卷</el-button>
                  <el-button type="danger" size="small" @click="cancelRelease(scope.row.testPaper.tp_id)" plain>取消发布</el-button>
                </div>
                <div v-if="user_status=='student'">
                  <el-button type="primary" size="small" @click="openTestPaper(scope.row.tp_id)" plain>
                    {{scope.row.status=='进行中'? '开始考试':'查看试卷'}}
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 其他班级成员表格 -->
        <div class="user_list table" v-if="tab_classes=='user_list'">
          <el-table :data="userData" style="width: 100%">
            <el-table-column prop="user.number" label="用户id" > </el-table-column>
            <el-table-column prop="user.name" label="成员名称" > </el-table-column>
            <el-table-column prop="enter_date" label="加入时间" > </el-table-column>
            <el-table-column prop="status" label="身份" > </el-table-column>
            <el-table-column prop="operate" label="操作" width="300"> 
              <template slot-scope="scope" v-if="tab_classes=='user_list'">
               <el-button type="primary" size="small" @click="openPaper(scope.row.c_id, scope.row.classes.name)" plain>查看该学生的考试记录</el-button>
               <el-button type="danger" size="small" @click="outUser(scope.row.u_id)" plain>踢出班级</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>



        
        <!-- 更改考试时间弹框 -->
        <el-dialog class="releaseTest" title="更改考试时间" 
          :visible.sync="changeTestDateDialog" width="40%" 
          @close="releaseTestDate = ''">

            <!-- 选择考试时间 -->
            <el-date-picker
                v-model="releaseTestDate"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>

            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="lastStep()" > 取消 </el-button>
                <el-button type="primary"  size="medium" @click="doChangeTestDate()"> 确认更改 </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import "@/assets/less/main/classesSpace.less";
export default {
  name: "ClassesSpace",
  data() {
    return {
        Classes_id: "班级不存在",

        //用户当前身份
        user_status: 'student',

        //当前班级数据
        classesData: {
          classes:{},
          user:{}
        },

        //是否打开班级简介
        isopenIntroduction:false,

        //是否为修改班级信息状态
        isEditClasses:false,
        //修改班级信息的数据
        editClassesData:{
            name: "",
            joinWay: "all",
            introduction: ""
        },

        //
        tab_classes: "test_list",

        //试卷信息数据
        TestData: [],

        //班级其他成员数据
        userData:[],

        //更改考试时间弹框
        changeTestDateDialog: false,

        //更改的考试时间
        releaseTestDate: [],
        //
        updateTp_id: 0,
    };
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
    goNewRouter(name){
      const {href}=  this.$router.resolve(name)
      console.log(href);
      window.open('/#/test', '_blank');
    },

    //获取班级信息
    getClassesData() {
      //获取班级信息
      this.$axios({
        method: "get",
        url: "/queryClassesByC_id",
        params: {
          token: localStorage.getItem('_token'),
          c_id: this.$route.params.id,
        },
      })
        .then((result) => {
          console.log("result ==> ", result);
          if(result.data.code == 200){
            this.classesData = result.data.data;
          
            this.editClassesData.name=result.data.data.classes.name;
            this.editClassesData.joinWay=result.data.data.classes.joinWay;
            this.editClassesData.introduction=result.data.data.classes.introduction;
          }else{
            this.$message(result.data.msg);
          }
        })
        .catch((err) => {
          console.log("err ==> ", err);
        });

      this.getClassesMembers();
    },

    //获取班级成员信息
    getClassesMembers(){
      this.$axios({
        method: "get",
        url: "/queryUserByC_id",
        params: {
          token: localStorage.getItem("_token"),
          c_id: this.$route.params.id,
        },
      })
        .then((result) => {
          console.log("result ==> ", result);

           if(result.data.code == 200){
              //去除创建人的数据
              for(let i=0;i<result.data.data.length;i++){
                if(result.data.data[i].status=="创建者"){
                  result.data.data.splice(i,1);
                  break;
                }
              }
              this.userData = result.data.data;
          }else{
            this.$message(result.data.msg);
          }
         
        })
        .catch((err) => {
          console.log("err ==> ", err);
        });
    },

    //获取班级试卷信息
    getClassesTestPaper(){
      this.$axios({
        method: "get",
        url: "/getTestpapertByC_id",
        params: {
          token: localStorage.getItem("_token"),
          c_id: this.$route.params.id,
        },
      })
        .then((result) => {
          console.log("result ==> ", result);
           if(result.data.code == 200){
             var data = result.data.data;
            //处理数据
            for (let i = 0; i < data.length; i++) {
              //判断考试是否结束
              var nowDate = new Date().getTime();
              var deadlineTime =  new Date(data[i].deadline).getTime();
              if(nowDate > deadlineTime){
                data[i].status = '已结束';
              }
              //判断是否已答题完毕
              if(data[i].testPaper.userGrade == null){
                data[i].status = '进行中';
              }else{
                data[i].status = '答题完毕';
                //判断是否公开成绩
                if(data[i].publishScore == 0){
                  data[i].testPaper.userGrade.grade = '--';
                }else{
                  data[i].testPaper.userGrade.grade += '分';
                }
              }
              
            }

            this.TestData = result.data.data;
          }else{
            this.$message(result.data.msg);
          }
         
        })
        .catch((err) => {
          console.log("err ==> ", err);
        });
    },

    //修改班级信息
    editClasses(){
      this.isopenIntroduction = true;
      if(this.isEditClasses){
        var classes = this.classesData.classes;
        //判断用户是否改变数据
        if(this.editClassesData.name==classes.name&&this.editClassesData.joinWay==classes.joinWay&&this.editClassesData.introduction==classes.introduction){
            console.log("数据没有改变");
        }else{
           //处理班级加入方式
            var joinWay=""
            if(this.editClassesData.joinWay=="允许任何人加入"){
              joinWay="all"
            }
            if(this.editClassesData.joinWay=="需要管理员同意申请"){
                joinWay="apply"
            }
            if(this.editClassesData.joinWay=="不允许任何人加入"){
                joinWay="no"
            }

            // 处理post请求参数
            var request={
                token: localStorage.getItem("_token"),
                c_id: classes.c_id,
                name: this.editClassesData.name,
                joinWay: joinWay,
                introduction: this.editClassesData.introduction,
                people_num: classes.people_num
            }
            request=this.$qs.stringify(request)  

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
              }else{
                this.$message(result.data.msg);
              }
            })
            .catch((err) => {
              console.log("err ==> ", err);
              this.$message(result.data.msg);
            });
        }
      }

      this.isEditClasses=!this.isEditClasses;

    },

    //把学生踢出班级
    outUser(u_id) {
        this.$confirm(' 这将会删除他所有与班级有关的信息', '是否确定删除学生?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          // 处理post请求参数
            var request={
                token: localStorage.getItem("_token"),
                u_id: u_id,
                c_id: this.classesData.c_id
            }
            request=this.$qs.stringify(request)  

          //删除学生记录
          this.$axios({
            method: "post",
            url: "/outClassesByteacher",
            data: request,
          })
            .then((result) => {
              console.log(" result", result);
              if (result.data.msg == "退出成功") {
                this.$message({ message: "删除学生成功", type: "success" });
                this.getClassesMembers();;
              }else{
                this.$message(result.data.msg);
              }
            })
            .catch((err) => {
              console.log("err ==> ", err);
            });
          
        }).catch(() => { });
    },

    //更改考试时间弹框
    changeTestDate(tp_id){
      this.changeTestDateDialog = true;
      this.updateTp_id = tp_id;
      console.log(tp_id);
    },

    //更改考试时间数据库操作
    doChangeTestDate(){
      //考试开始时间
      var start_date = this.getFormatDate(new Date(this.releaseTestDate[0]));
      //考试结束时间
      var deadline = this.getFormatDate(new Date(this.releaseTestDate[1]));
      //当前时间
      var release_time = this.getNowFormatDate('yyyy-MM-dd hh:mm:ss');

      //获取token
      var token=localStorage.getItem("_token");
      // 处理post请求参数
      var request={
          token,
          tp_id: this.updateTp_id,
          c_id: this.classesData.c_id,
          release_time,
          start_date,
          deadline
      }
      request=this.$qs.stringify(request, { indices: false })
      this.$axios({
          method: "post",
          url: "/updateReleaseTest",
          data: request,
      }).then((result) => {
          console.log("getTestPaper_classes result ==> ", result);
          if(result.data.code=200){
            this.getClassesTestPaper();
            this.changeTestDateDialog = false;
            this.$message.success("更改成功")
          }else{
              this.$message(result.data.msg)
          }
      }).catch((err) => {
          console.log("err ==> ", err);
      });
    },

    // 编辑试卷
    editTestPaper(tp_id){
      var {href}=  this.$router.resolve({
          name: 'TestPaperTch',
          params:{
            tp_id,
          }
      })
      console.log(href);
      window.open(href, '_blank');
    },

    // 取消发布
    cancelRelease(tp_id){
      this.$confirm('此操作将删除试卷在该班级的所有信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          //获取token
          var token=localStorage.getItem("_token");
          // 处理post请求参数
          var request={
              token,
              tp_id,
              c_id: this.classesData.c_id,
          }
          request=this.$qs.stringify(request)
          this.$axios({
              method: "post",
              url: "/cancelRelease",
              data: request,
          }).then((result) => {
              if(result.data.code=200){
                this.getClassesTestPaper();
                this.$message.success("已取消发布");
              }else{
                  this.$message(result.data.msg)
              }
          }).catch((err) => {
              console.log("err ==> ", err);
          });
        }).catch(() => {
                  
        });
      
    },

    //开始考试
    openTestPaper(tp_id){
      var {href}=  this.$router.resolve({
          name: 'TestPaperStu',
          params:{
            tp_id,
            c_id:this.classesData.c_id
          }
      })
      console.log(href);
      window.open(href, '_blank');
    }
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
