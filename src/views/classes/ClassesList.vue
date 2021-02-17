<template>
  <div class="classesList">

    <div class="list-header" :class="isFixed?'isFixed':''" :style="topic_nav_style">
      <span class="classesTitle">我加入的班级</span>
      <el-button type="primary" size="medium" icon="el-icon-plus" @click="createClassesDialog = true" class="createClasses">创建班级</el-button>
      <div class="enterClasses">
        <el-input v-model="enterClasses_id" size="small" placeholder="请输入班级编号" prefix-icon="el-icon-search" ></el-input>
        <el-button type="primary" size="small" @click="joinClasses()">查询</el-button>
      </div>
    </div>

    <!-- <el-divider></el-divider> -->
    <!-- 班级列表 -->

    <div class="class-list">
      <div class="class-box"  v-for="(item,index) in tableData" :key="index">
        <div class="title" >
          <div class="classNo">{{item.classes.number}}</div>
          <div class="className">{{item.classes.name}}</div>
          
        </div>
        <div class="info" >
          <div class="info-row">
            <div class="info-item">加入时间 : {{item.enter_date}}</div>
            <div class="info-item">班级人数 : {{item.classes.people_num}} 人</div>
          </div>
          <div class="info-row">
            <div class="info-item">加入限制 : {{item.classes.joinWay}}</div>
            <div class="info-item creator">创建者 : {{item.classes.creatorName}}</div>
          </div>
          
          <div class="info-item">班级简介 : <p>{{item.classes.introduction}}</p>
          </div>
        </div>
        <div class="title-but">
          <el-button type="primary" @click="openPaper(item.classes.c_id,item.classes.name)">进入班级</el-button>
          <el-button type="info" plain>设置</el-button>
          <el-button type="danger" plain @click="outClasses(item.classes.c_id)">退出班级</el-button>
        </div>

      </div>
    </div>



    <!-- 创建班级对话框 -->
    <el-dialog title="创建班级" :visible.sync="createClassesDialog" width="42%">
      <el-form :inline="true" :model="createClassesData" :rules="rules" status-icon ref="createClassesForm">
        <el-form-item label="创建班级的名称" prop="name">
          <el-input v-model="createClassesData.name" size="small" placeholder="请输入班级名称" ></el-input>
        </el-form-item>
        <el-form-item label="班级允许的加入方式">
          <el-select v-model="createClassesData.joinWay" placeholder="请选择" size="small">
            <el-option v-for="item in joinWayOptioins" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createClassesDialog = false">取 消</el-button>
        <el-button type="primary" @click="createClasses('createClassesForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/less/main/classeslist.less";
export default {
  name: "ClassesList",
  data() {
    var checkName = (rule, value, callback) => {
      var reg = /^[\u4e00-\u9fa5\w]{3,16}$/;
      if (!reg.test(value)) {
        callback(new Error("班级名称只能是3-16位汉字、字母、数字、下划线"));
      } else {
        callback();
      }
    };
    return {
      test_id: "",
      user_status: "",

      //申请加入班级的id
      enterClasses_id: "",

      //是否显示创建班级表单
      isCreateClasses: false,

      //创建班级中班级允许加入方式的选项
      joinWayOptioins: [
        {
          value: "all",
          label: "允许任何人加入",
        },
        {
          value: "apply",
          label: "需要管理员同意加入",
        },
        {
          value: "no",
          label: "不允许任何人加入",
        },
      ],

      //创建班级的数据
      createClassesData: {
        name: "",
        joinWay: "all",
      },

      //创建班级对话框
      createClassesDialog: false,

      //参加班级的数据
      enterClassesData: {
        classes: {
          number: "",
          name: "",
          joinWay: "",
          create_data: "",
          people_num: "",
          introduction: "",
        },
        user: {
          name: "",
        },
      },

      rules: {
        name: [{ validator: checkName, trigger: "change" }],
      },

      //我加入的班级的table数据
      tableData: [],

      //侧导航栏是否悬浮
      isFixed: false,
      topic_nav_style:"top:0px",
    };
  },

  created() {
    // this.user_id=this.$root.user_id
    this.user_status = localStorage.getItem("user_status");
    this.getClasses();
  },

  mounted() {
    // 监听滚动事件，然后用handleScroll这个方法进行相应的处理
    // document.getElementsByClassName('tab-item')[0]
    document.getElementsByClassName('tab-item')[0].addEventListener("scroll", this.handleScroll);
  },

  methods: {
    //获取用户所有的班级信息
    getClasses() {
      this.$axios({
        method: "get",
        url: "/queryClassesByU_id",
        params: {
          token: localStorage.getItem("_token"),
        },
      })
        .then((result) => {
          console.log("result ==> ", result);
          if ((result.data.code = 200)) {
            this.tableData = result.data.data;
          } else {
            this.tableData = [];
          }
        })
        .catch((err) => {
          console.log("err ==> ", err);
        });
    },

    //打开试卷页面
    openPaper(id, title) {
      this.$emit("openPaper", id, title);
    },

    //创建班级
    createClasses(formName) {
      this.createClassesDialog = false;

      console.log(this.createClassesData);
      //获取token
      var token = localStorage.getItem("_token");
      // 处理post请求参数
      var request = {
        token,
        name: this.createClassesData.name,
        date: this.getNowFormatDate("yyyy-MM-dd hh:mm:ss"),
        joinWay: this.createClassesData.joinWay,
      };
      request = this.$qs.stringify(request);

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios({
            method: "post",
            url: "/createClasses",
            data: request,
          })
            .then((result) => {
              console.log("register -> result", result);
              if (result.data.code == 200) {
                this.$message({
                  message: "创建班级成功",
                  type: "success",
                });
                this.getClasses();
              } else {
                this.$message(result.data.msg);
              }
            })
            .catch((err) => {
              console.log("err ==> ", err);
              this.$message(result.data.msg);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    
    //退出班级
    outClasses(c_id) {
      this.$confirm(" 这将会删除所有与班级有关的信息", "是否确定退出班级?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          // 处理post请求参数
          var request = {
            token: localStorage.getItem("_token"),
            c_id: c_id,
          };
          request = this.$qs.stringify(request);

          this.$axios({
            method: "post",
            url: "/outClasses",
            data: request,
          })
            .then((result) => {
              console.log(" result", result);
              if (result.data.code == 200) {
                this.$message.success("退出成功");
                this.getClasses();
              } else {
                this.$message(result.data.msg);
              }
            })
            .catch((err) => {
              console.log("err ==> ", err);
            });
        })
        .catch(() => {});
    },

    //滚动事件
    handleScroll() {
      // 滚动条偏移量
      // let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop; 
      let scrollTop = document.getElementsByClassName('tab-item')[0].scrollTop;

      console.log();
      if (scrollTop > 1) {
        this.topic_nav_style ="top:"+ (scrollTop + 10) + "px";
        this.isFixed = true;
      } else {
        this.isFixed = false;
        this.topic_nav_style ="top: 0px";
      }
    },
  },
};
</script>
