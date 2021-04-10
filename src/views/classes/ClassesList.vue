<template>
  <div class="classesList">

    <div class="list-header" :class="isFixed?'isFixed':''" :style="topic_nav_style">
      <span class="classesTitle">我加入的班级</span>
      <el-button type="primary" size="medium" icon="el-icon-plus" v-if="$role('teacher')" @click="createClassesDialog = true" class="createClasses">创建班级</el-button>
      <div class="enterClasses">
        <el-input v-model="classesInfo" size="small" placeholder="请输入班级编号或者班级名称" prefix-icon="el-icon-search"></el-input>
        <el-button type="primary" size="small" @click="getClasses(classesInfo)">查询</el-button>
      </div>
    </div>

    <div class="class-list" v-loading="loading">
      <h4 v-if="tableData.length == 0">暂无参加的班级</h4>
      <div class="class-box" v-for="(item,index) in tableData" :key="index">
        <div class="title">
          <div class="classNo">C{{item.classesId}}</div>
          <div class="className">{{item.classesName}}</div>

        </div>
        <div class="info">
          <div class="info-row">
            <div class="info-item">加入时间 : {{item.enterDate}}</div>
            <div class="info-item">班级人数 : {{item.peopleNum}} 人</div>
          </div>
          <div class="info-row">
            <div class="info-item">加入限制 : {{item.joinway}}</div>
            <div class="info-item creator">创建者 : {{item.creatorName}}</div>
          </div>

          <div class="info-item">班级简介 : <p>{{item.introduction}}</p>
          </div>
        </div>
        <div class="title-but">
          <el-button size="medium" type="primary" @click="openPaper(item.classesId,item.classesName)">进入班级</el-button>
          <el-button size="medium" type="info" @click="editClassesBut(item)" plain v-if="$role('teacher')">设置</el-button>
          <el-button size="medium" type="danger" plain @click="outClasses(item.classesId)">
            {{$role('teacher') ? '删除班级':'退出班级'}}
          </el-button>
        </div>

      </div>
    </div>

    <div class="page">
      <el-pagination  background layout="total, prev, pager, next,jumper"  @current-change="currentChange" :total="total" :page-size="pageSize"/>
    </div>


    <!-- 创建班级对话框 -->
    <el-dialog title="创建班级" :visible.sync="createClassesDialog" width="42%">
      <el-form label-position="right" :model="createClassesData" :rules="rules" status-icon label-width="auto" ref="createClassesForm">
        <el-form-item label="创建班级的名称" prop="name">
          <el-input v-model="createClassesData.name" size="small" placeholder="请输入班级名称"></el-input>
        </el-form-item>
        <el-form-item label="班级允许的加入方式">
          <el-select v-model="createClassesData.joinWay" placeholder="请选择" size="small">
            <el-option v-for="item in joinWayOptioins" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级简介" prop="introduction">
          <el-input v-model="createClassesData.introduction" 
          autosize 
          type="textarea" 
          show-word-limit
          size="medium"
          placeholder="请输入班级简介"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createClassesDialog = false">取 消</el-button>
        <el-button type="primary" @click="createClasses('createClassesForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改班级对话框 -->
    <el-dialog title="修改班级" :visible.sync="editClassesDialog" width="42%">
      <el-form :inline="true" :model="editClassesData" :rules="rules" status-icon ref="editClassesForm">
        <el-form-item label="班级的名称" prop="name">
          <el-input v-model="editClassesData.classesName" size="small" placeholder="请输入班级名称"></el-input>
        </el-form-item>
        <el-form-item label="班级允许的加入方式">
          <el-select v-model="editClassesData.joinway" placeholder="请选择" size="small">
            <el-option v-for="item in joinWayOptioins" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级简介" prop="introduction">
          <el-input v-model="editClassesData.introduction" 
          autosize 
          type="textarea" 
          show-word-limit
          size="medium"
          placeholder="请输入班级简介"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editClassesDialog = false">取 消</el-button>
        <el-button type="primary" @click="editClasses('editClassesForm')">确 定</el-button>
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
      classesInfo: "",

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
        introduction: ""
      },

      //创建班级的数据
      editClassesData: {},

      //创建班级对话框
      createClassesDialog: false,
      //修改班级对话框
      editClassesDialog: false,

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
      topic_nav_style: "top:0px",

      currentPage: 1,
      pageSize: 8,
      total: null,

      loading: false,
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
    document
      .getElementsByClassName("tab-item")[0]
      .addEventListener("scroll", this.handleScroll);
  },

  methods: {
    //获取用户的班级列表
    getClasses() {
      this.loading = true
      let params = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        keyword: this.classesInfo
      }
      setTimeout(() => {
        this.$http.get('/queryClassesList',{params}).then( res =>{
          this.tableData = res.data.content;
          this.total = res.data.total
          this.loading = false
        })
      }, 500);
      
    },

    //切换分页时触发
    currentChange(val) {
      console.log(val);
      this.currentPage = val
      this.getClasses()
    },

    //打开试卷页面
    openPaper(id, title) {
      this.$emit("openPaper", id, title);
    },

    //创建班级
    createClasses(formName) {
      this.createClassesDialog = false;
      // 处理post请求参数
      var request = {
        classesName: this.createClassesData.name,
        joinway: this.createClassesData.joinWay,
        creatorName: this.$store.state.userName,
        introduction: this.createClassesData.introduction,
      };

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('/createClasses',request).then(res =>{
            if(res.code == 200){
              this.$message.success('创建班级成功')
              this.getClasses();
            }
          })
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
          var params = {
            c_id: c_id,
          };
          this.$http.delete('/outClasses',{params}).then(res =>{
            if(res.code == 200){
              this.$message.success('退出班级成功')
              this.getClasses();
            }
          })
          
        })
        .catch(() => {});
    },

    //修改班级按钮
    editClassesBut(val) {
      this.editClassesDialog = true;
      console.log(val);
      this.editClassesData = JSON.parse(JSON.stringify(val)); //深拷贝
    },

    //修改班级按钮
    editClasses(formName) {
      //修改班级信息
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.editClassesData);
          //处理班级加入方式
          var joinway = this.editClassesData.joinway;
          if (this.editClassesData.joinway == "允许任何人加入") {
            joinway = "all";
          }
          if (this.editClassesData.joinway == "需要管理员同意申请") {
            joinway = "apply";
          }
          if (this.editClassesData.joinway == "不允许任何人加入") {
            joinway = "no";
          }
          // 处理post请求参数
          var request = {
            classesId: this.editClassesData.classesId,
            introduction: this.editClassesData.introduction,
            joinway: joinway,
            // joinway: this.editClassesData.joinway,
            classesName: this.editClassesData.classesName
          };
            console.log(request);
          this.$http.put('/updateClasses',request).then(res =>{
            if(res.code == 200){
              this.$message.success('修改班级信息成功')
              this.editClassesDialog = false;
              this.getClasses();
            }
          })
        }
      });
    },

    //滚动事件
    handleScroll() {
      // 滚动条偏移量
      // let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      let scrollTop = document.getElementsByClassName("tab-item")[0].scrollTop;

      console.log();
      if (scrollTop > 1) {
        this.topic_nav_style = "top:" + (scrollTop + 10) + "px";
        this.isFixed = true;
      } else {
        this.isFixed = false;
        this.topic_nav_style = "top: 0px";
      }
    },
  },
};
</script>

<style lang="less">
.page{
  margin: 24px 0 12px;
  padding: 6px 24px;
  padding-right: 48px;
  background: #fafafa;
  border-radius: 4px;
  text-align: right;
}
</style>
