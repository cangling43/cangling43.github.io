<template>
  <div class="content-bg">
    <div class="tab-title">
      <div class="tabTitle-item" v-for="(item,index) in menu" :key="index" :class="activeId==item.id?'active':''" @click="goRouter(item)" :title="item.title">
        <div class="title">{{item.title}}</div>
        <span v-if="index!=0" class="el-icon-close" @click.stop="removePaper(item.id)"></span>
      </div>
    </div>
    <div class="classesNameInput">
      <el-input v-model="enterClasses_id" size="small" placeholder="请输入班级编号" ></el-input>
      <el-button type="primary" size="small" @click="joinClasses()">申请加入</el-button>
    </div>
    <div class="tab-item">
      <router-view @openPaper="openPaper" />
    </div>


    <!-- 加入班级弹框 -->
    <div class="dialog">
      <el-dialog title="确定加入该班级" :visible.sync="dialogVisible" width="30%">
        <p>班级编号 : {{enterClassesData.classes.number}}</p>
        <p>班级名称 : {{enterClassesData.classes.name}}</p>
        <p>创 建 者 : {{enterClassesData.user.name}}</p>
        <p>加入方式 : {{enterClassesData.classes.joinWay}}</p>
        <p>创建时间 : {{enterClassesData.classes.create_date}}</p>
        <p>班级人数 : {{enterClassesData.classes.people_num}}</p>
        <p>班级简介 : {{enterClassesData.classes.introduction}}</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="doEnterClasses">加入</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import "../assets/less/my_tab.less";
export default {
  inject:['reload'],
  name: "MyTab",
  props: ["menu", "openFinishTestId", "paperName", "listName"],
  data() {
    return {
      activeId: "-1",

      enterClasses_id: "",//申请加入班级的id

      dialogVisible: false,//查询班级对话框

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
      // menu:[
      //     {title:"我审批过的试卷",path:"/main/myCheckTest/checkTestList",name:"CheckTestList",id:"-1"},
      //     {title:"试卷1",path:"/main/myCheckTest/checkTestList",name:"CheckTest",id:"0001",closable:false}
      // ]
    };
  },

  created() {
    //查询sessionStorage记录 , 生成用户已经打开过的页面
    if (sessionStorage[this.openFinishTestId] != null) {
      var openCheckTestId = JSON.parse(
        sessionStorage.getItem(this.openFinishTestId)
      );

        this.menu.push({
          title: openCheckTestId.title,
          // path:"/main/myCheckTest/checkTest",
          name: this.paperName,
          id: openCheckTestId.id,
        });

      // console.log(openCheckTestId);
    }

    if (this.$route.params.id == undefined) {
      this.activeId = "-1";
    } else {
      this.activeId = this.$route.params.id;
    }
  },
  methods: {
    //路由跳转
    goRouter(item) {
      if (this.activeId == item.id) {
        return;
      }
      this.activeId = item.id;
      this.$router.push({
        name: item.name,
        params: { id: item.id },
      });
    },

    //打开新的试卷
    openPaper(id, title) {
      //sessionStorage存储   刷新后依旧有效
      //如果openCheckTestId不存在,初始化openCheckTestId
      if (sessionStorage[this.openFinishTestId] == null) {
        var openCheckTestId = {
          title: title,
          id: id,
        };
        sessionStorage.setItem(
          this.openFinishTestId,
          JSON.stringify(openCheckTestId)
        );

        //把页面添加到menu
        this.menu.push({
          title,
          // path:"/main/myCheckTest/checkTest",
          name: this.paperName,
          id: id,
        });
      } else {
        var openCheckTestId = JSON.parse(
          sessionStorage.getItem(this.openFinishTestId)
        );

        //如果该页面没有记录到sessionStorage里
        if (openCheckTestId.id != id) {
          openCheckTestId.id = id;
          openCheckTestId.title = title;
          sessionStorage.setItem(
            this.openFinishTestId,
            JSON.stringify(openCheckTestId)
          );

          //把页面添加到menu
          this.menu[1] = {
            title,
            // path:"/main/myCheckTest/checkTest",
            name: this.paperName,
            id: id,
          };
        }
      }

      // 跳转到该页面
      this.activeId = id;
      this.$router.push({
        name: this.paperName,
        params: { id: id },
      });
    },

    //关闭页面
    removePaper(id) {
      //删除当前页面
      for (let i = 0; i < this.menu.length; i++) {
        if (this.menu[i].id == id) {
          this.menu.splice(i, 1);
          break;
        }
      }

      sessionStorage.removeItem(this.openFinishTestId);

      //跳转回主页面
      this.activeId = "-1";
      this.$router.push({
        name: this.listName,
      });
    },

    //参加班级
    joinClasses() {
      //判断班级编码是否正确
      var reg = /^[0-9]{4,10}$/;
      var id = this.enterClasses_id;
      if (reg.test(id)) {
        //获取参加的班级信息
        this.$axios({
          method: "get",
          url: "/queryClassesByC_id",
          params: {
            c_id: this.enterClasses_id,
          },
        })
          .then((result) => {
            console.log(" result", result);

            if (result.data.code == 200) {
              this.enterClassesData = result.data.data;
              //显示弹框
              this.dialogVisible = true;
            } else {
              this.$message(result.data.msg);
            }
          })
          .catch((err) => {
            console.log("err ==> ", err);
          });
        //获取参加的班级信息  end
      } else {
        this.$message("请输入正确的班级编号");
      }
      //判断班级编码是否正确 end
    },

    doEnterClasses() {
      this.dialogVisible = false;

      // 处理post请求参数
      var request = {
        token: localStorage.getItem("_token"),
        c_id: this.enterClasses_id,
        date: this.getNowFormatDate("yyyy-MM-dd hh:mm:ss"),
      };
      request = this.$qs.stringify(request);

      //参加班级操作
      this.$axios({
        method: "post",
        url: "/joinClasses",
        data: request,
      })
        .then((result) => {
          console.log("register -> result", result);
          if (result.data.code == 200) {
            this.$message.success("加入成功!");
            // this.getClasses();
            // location.reload();
            this.reload();
          } else {
            this.$message(result.data.msg);
          }
        })
        .catch((err) => {
          console.log("err ==> ", err);
          this.$message(result.data.msg);
        });
      //参加班级操作 end
    },
  },
};
</script>

