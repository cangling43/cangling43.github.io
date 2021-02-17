<template>
    <div class="myTest content-bg ">
        <div class="tab-title" >
            <div class="tabTitle-item active">我的试卷</div>
        </div>
        <div class="tab-item">
            <el-form :inline="true" class="queryTest">
                <el-form-item label="试卷信息">
                    <el-input v-model="queryTestInfo" size="small" placeholder="请输入试卷信息" ></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="small" @click="queryTest()">查询</el-button>
                </el-form-item>
            </el-form>

            <span class="classesTitle">我创建的试卷</span>
            <el-button type="text"  icon="el-icon-plus" class="createClasses" 
            @click="createTestPaper">新建试卷</el-button>

            <el-divider></el-divider>

            <div class="table">
                <el-table :data="testPaperList" style="width: 100%">
                    <el-table-column prop="number" label="试卷编号" width="110" sortable>
                    </el-table-column>
                    <el-table-column prop="name" label="试卷名称" >
                    </el-table-column>
                    <el-table-column prop="enter_date" label="创建时间" width="180" sortable>
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.create_date }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="topic_num" label="题目数量" width="110" sortable>
                    </el-table-column>
                    <el-table-column prop="total_score" label="总分" width="110" sortable>
                    </el-table-column>
                    <el-table-column prop="pass_mark" label="及格分数" width="110" sortable>
                    </el-table-column>
                    <el-table-column prop="subject.name" label="试卷类型" width="100" >
                    </el-table-column>
                    <el-table-column label="操作" width="240">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini"  plain
                            @click="releaseTest(scope.row.tp_id,scope.row.name)">发布考试</el-button>
                            <el-button type="info" size="mini"  plain
                             @click="editTestPaper(scope.row.tp_id)">编辑</el-button>
                            <el-button type="danger" size="mini"  plain
                             @click="deleteTest(scope.row.tp_id)">删除</el-button>
                        </template>
                    </el-table-column>
                    
                </el-table>
            </div>

            <!-- 发布考试弹框 -->
            <el-dialog class="releaseTest" :title="releaseTestName" 
             :visible.sync="releaseTestDialog" width="70%" 
             @close="closeReleaseTestDialog">

                <el-steps  :active="releaseTestSteps" finish-status="success" align-center>
                    <el-step title="选择班级" ></el-step>
                    <el-step title="选择考试时间" ></el-step>
                    <el-step title="发布考试" ></el-step>
                </el-steps>

                <!-- 选择班级 -->
                <div v-if="releaseTestSteps==0">
                    <el-table ref="multipleTable" :data="classesData" height="350"
                        tooltip-effect="dark" style="width: 100%" 
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55"> </el-table-column>
                        <el-table-column prop="classes.number" label="班级编号"  width="120" sortable></el-table-column>
                        <el-table-column prop="classes.name" label="班级名称" ></el-table-column>
                        <el-table-column prop="date" label="考试时间" width="310"></el-table-column>
                        <el-table-column prop="status" label="状态" width="150" sortable></el-table-column>
                    </el-table>
                    <!-- <el-pagination class="pagination" layout="prev, pager, next" hide-on-single-page
                    :total="classesData.length" :page-size="page_size" 
                    @current-change="handleCurrentChange">
                    </el-pagination> -->
                </div>

                <!-- 选择考试时间 -->
                <div v-if="releaseTestSteps==1">
                    <el-date-picker
                        v-model="releaseTestDate"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </div>


                <span slot="footer" class="dialog-footer">
                    <el-button size="medium"
                    @click="lastStep()" >
                        {{releaseTestSteps==1?'上一步':'取消'}}
                    </el-button>
                    <el-button type="info" v-if="releaseTestSteps==0" size="medium">
                        取消发布
                    </el-button>
                    <el-button type="primary" @click="nestStep()" size="medium">
                        {{releaseTestSteps==0?'下一步':'发布考试'}}
                    </el-button>
                </span>
            </el-dialog>

        </div>
    </div>
</template>

<script>
import "../../assets/less/my_tab.less"
import "../../assets/less/main/myTest.less"
export default {
    name:"MyTest",

    data() {
        return {
            //所有的试卷列表
            testPaperList: [],

            // 用户所创建的班级
            classesData: [],

            //发布试卷记录
            testPaper_classes:[],

            // 查询试卷信息的tp_id
            queryTestInfo: '',

            //是否显示发布考试_弹框
            releaseTestDialog: false,

            //当前选择的试卷名称
            releaseTestName:'',
            //当前选择的试卷id
            releaseTestPaperId: '',
            //考试日期
            releaseTestDate: '',

            //发布考试步骤状态
            releaseTestSteps: 0,

            //已选择的班级
            selectionClasses: [],


            //一页有多少行
            page_size: 6,
            //按照分页显示在页面的班级 ----一页6行数据
            showclasses: [],
        };
    },

    created(){
        
        this.getTestPaperList();
    },

    methods:{
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
                    
                    if(result.data.code == 200){
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
                    if(result.data.code=200){
                        this.testPaper_classes = result.data.data;

                        //修改班级考试信息
                        for(let tc of this.testPaper_classes){
                            for(let c of this.classesData){
                                if(tc.c_id == c.c_id){
                                    c.status="已发布";
                                    c.date=tc.start_date+" 至 "+tc.deadline;
                                }
                            }
                        }
                        console.log(this.classesData);


                    }else{
                        this.testPaper_classes = [];
                    }
                })
                .catch((err) => {
                    console.log("err ==> ", err);
                });
        },

        //去创建新试卷
        createTestPaper(){
            const {href}=  this.$router.resolve({
                name: 'TestPaperTch'
            })
            console.log(href);
            window.open(href, '_blank');
        },

        //弹出发布考试对话框,用户选择班级与时间
        releaseTest(tp_id,name){
            this.releaseTestDialog = true;
            this.releaseTestName = "发布试卷名称: "+name;
            this.releaseTestPaperId = tp_id;

            //先查找用户所创建的班级 , 再查找已发布考试的记录
            new Promise((resolve,reject)=>{
                //获取用户所有的班级信息
                this.$axios({
                    method: "get",
                    url: "/queryClassesByU_id",
                    params: {
                        token:localStorage.getItem("_token")
                    },
                })
                    .then((result) => {
                        //添加发布状态与考试日期
                        result.data.data.map(v=>{
                            v.status="未发布"
                            v.date="--"
                        })
                        
                        console.log("result ==> ", result);           
                        if(result.data.code=200){
                            this.classesData = result.data.data;
                            this.showclasses = result.data.data.slice(0,this.page_size)
                        }else{
                            this.classesData = [];
                        }

                        //查询成功
                        resolve();
                    })
                    .catch((err) => {
                        console.log("err ==> ", err);
                    });
                
            }).then(()=>{
                this.getTestPaper_classes(tp_id)
            })
            
            
        },

        //发布考试对话框中的上一步
        lastStep(){
            this.releaseTestSteps==1? this.releaseTestSteps=0 : this.releaseTestDialog = false;
            console.log(this.$refs.multipleTable);
            setTimeout(()=>{
                this.selectionClasses.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                })
            },100)
        },
        
        //发布考试对话框中的下一步
        nestStep(){
            //判断是否有选择班级
            if(this.selectionClasses.length==0){
                this.$message("请选择班级")
                return
            }

            //下一步 ---选择时间
            if(this.releaseTestSteps==0){
                console.log(this.selectionClasses);
                this.releaseTestSteps++
                return
            }

            //判断是否有选择考试时间
            if(this.releaseTestDate == null){
                this.$message("请选择考试时间")
                return
            }else if(this.releaseTestDate.length != 2){
                this.$message("请选择考试时间")
                return
            }


            if(this.releaseTestSteps==1){
                //判断已选择的班级是否包含该试卷已发布的班级
                var isHas = false;
                for (let i = 0; i < this.selectionClasses.length; i++) {
                    for (let j = 0; j < this.testPaper_classes.length; j++) {
                        if(this.selectionClasses[i].c_id == this.testPaper_classes[j].c_id){
                            isHas = true;
                            break;
                        }
                    }
                    if(isHas){
                        break;
                    }
                }
                if(isHas){
                    //提示
                    this.$confirm('已选中的班级中包括已发布的班级,该操作将会覆盖之前的考试时间! 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.doReleaseTest()
                    })
                }else{
                    this.doReleaseTest()
                }
                

            }
            
        },

        //确定发布考试 -----向后端发送请求
        doReleaseTest(){
            //考试开始时间
            var start_date = this.getFormatDate(new Date(this.releaseTestDate[0]));
            //考试结束时间
            var deadline = this.getFormatDate(new Date(this.releaseTestDate[1]));
            //当前时间
            var release_time = this.getNowFormatDate('yyyy-MM-dd hh:mm:ss');
            //班级id
            var classesId = [];
            for (let i = 0; i < this.selectionClasses.length; i++) {
                classesId.push(this.selectionClasses[i].c_id)
            }

            //获取token
            var token=localStorage.getItem("_token");
            // 处理post请求参数
            var request={
                token,
                tp_id: this.releaseTestPaperId,
                c_id: classesId,
                release_time,
                start_date,
                deadline
            }
            request=this.$qs.stringify(request, { indices: false })
            this.$axios({
                method: "post",
                url: "/releaseTest",
                data: request,
            }).then((result) => {
                console.log("getTestPaper_classes result ==> ", result);
                if(result.data.code=200){
                    this.closeReleaseTestDialog()
                    this.$message.success("发布成功")
                }else{
                    this.$message(result.data.msg)
                }
            }).catch((err) => {
                console.log("err ==> ", err);
            });
        },

        //关闭对话框
        closeReleaseTestDialog(){
            //初始化数据
            this.releaseTestDialog = false
            this.selectionClasses  = [];
            this.releaseTestDate   = '';
            this.releaseTestSteps  = 0;
        },

        // 编辑试卷
        editTestPaper(tp_id){
            const {href}=  this.$router.resolve({
                name: 'TestPaperTch',

            })
            console.log(href);
            window.open(href+'/'+tp_id, '_blank');
        },

        //删除试卷
        deleteTest(tp_id){

        },

        //发布考试中已选择的班级
        handleSelectionChange(val) {
            console.log(val);
            this.selectionClasses = val;
        },

        //切换分页时触发
        handleCurrentChange(val){
            console.log(val);
            if(this.page_size*val>this.classesData.length){
                this.showclasses=this.classesData.slice(this.page_size*(val-1),this.classesData.length)
            }else{
                this.showclasses=this.classesData.slice(this.page_size*(val-1),this.page_size*val)
            }
        },

    }
}
</script>
