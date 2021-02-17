<template>
  <div class="markTest">
    <TopTab title="审批试卷">
      <div class="content">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
          <el-tab-pane label="待审批" name="mark">待审批</el-tab-pane>
          <el-tab-pane label="审批完成" name="finish">审批完成</el-tab-pane>
          <el-tab-pane label="全部" name="all">

            <el-collapse v-model="activeTestPaperList" @change="handleChange">
              <el-collapse-item :title="item.name" :name="item.tp_id" v-for="(item , index) in testPaperList" :key="index" >

                <el-table :data="item.classesList" style="width: 100%">
                  <el-table-column prop="classes.number" label="班级id" >
                  </el-table-column>
                  <el-table-column prop="classes.name" label="班级" >
                  </el-table-column>
                  <el-table-column prop="classes.people_num" label="人数" >
                  </el-table-column>
                  <el-table-column label="操作"> 
                    <template slot-scope="scope" >
                      <el-button type="primary" size="small" @click="openPaper(scope.row.c_id, scope.row.classes.name)" plain>审批试卷</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="status" label="状态" width="200">
                  </el-table-column>

                </el-table>
              </el-collapse-item>
            </el-collapse>

          </el-tab-pane>
        </el-tabs>

      </div>

    </TopTab>
  </div>
</template>

<script>
import TopTab from "../../components/TopTab.vue";
import "../../assets/less/main/markTest.less";
export default {
  name: "MyCheckTest",
  components: {
    TopTab,
  },
  data() {
    return {
      activeName: "all",
      testPaperList:[],
      activeTestPaperList: [],
      tableData: [
        {
          number: "C00011",
          name: "王小虎",
          status: "审批完成",
          people_num: 3+' 人'
        },
      ],
    };
  },
  created() {
    this.getTestPaperList();
  },
  methods: {
    handleClick() {
      console.log(this.activeName);
    },

    //获取试卷列表
    getTestPaperList(){
      this.$axios({
          method: "get",
          url: "/getTestPaperByU_id",
          params: {
              token:localStorage.getItem("_token")
          },
      })
        .then((result) => {
            console.log(result);
            
            if(result.data.code == 200){
              for (let i = 0; i < result.data.data.length; i++) {
                result.data.data[i].classesList = [];
              }
              this.testPaperList = result.data.data;
            }else{
                this.$message(result.data.msg)
            }
            
        })
        .catch((err) => {
            console.log("err ==> ", err);
        });
    },

    //获取发布试卷记录
    getTestPaper_classes(tp_id){
      this.$axios({
          method: "get",
          url: "/getClassesByTp_id",
          params: {
              tp_id
          },
      })
          .then((result) => {
            console.log("getTestPaper_classes result ==> ", result);
            var data = result.data.data;
            if(result.data.code=200){
              for (let i = 0; i < data.length; i++) {
                data[i].status=data[i].status == 0 ? '待审批':'审批完成';
              }

              


              for (let j = 0; j < this.testPaperList.length; j++) {
                if(tp_id == this.testPaperList[j].tp_id){
                  this.testPaperList[j].classesList = data;
                }
          }


              }else{
                  this.testPaper_classes = [];
              }
          })
          .catch((err) => {
              console.log("err ==> ", err);
          });
    },

    handleChange(val) {
        console.log(val);
        for (let i = 0; i < val.length; i++) {
          console.log(111);
          this.getTestPaper_classes(val[i]);
          
          
        }
        console.log(this.testPaperList);
      }
  },
};
</script>


