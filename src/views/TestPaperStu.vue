<template>
  <div class="createTest testPaper">
    <div class="w">
      <!-- 考试信息 -->
      <div class="title" >
        <h3 class="testName">{{ testData.testPaper.name }}</h3>
        <ul>
          <li class="test-info">试卷Id: {{ testData.testPaper.tp_id }}</li>
          <li class="test-info">出卷者: {{testData.classes.creatorName}}</li>
          <li class="test-info">答题时间: {{ testData.testPaper.time }} 分钟</li>
          <li class="test-info">截至时间: {{ testData.deadline }}</li>
          <li class="test-info">题目数量: 共 {{ testData.testPaper.topic_num }} 道</li>
          <li class="test-info">总分: {{ testData.testPaper.total_score }} 分</li>
        </ul>

        <ul>
          <li class="user-info">所属班级: {{ testData.classes.name }}</li>
          <li class="user-info">答题人: 李子建</li>
          <li class="user-info">答题人Id: 00001</li>
          <li class="fr">
            <el-button type="primary" size="mini" @click="submitTestpaper" :disabled="isRead">提交试卷</el-button>
          </li>
        </ul>
      </div>

      <div class="title fixed" v-if="isFixed">
        <ul>
          <li class="test-info"><strong class="testName">{{ testData.testPaper.name }}</strong></li>
          <li class="test-info">答题时间: {{ testData.testPaper.time }} 分钟</li>
          <li class="test-info">截至时间: {{ testData.deadline }}</li>
          <li class="test-info">剩余时间: {{ remainTime }}</li>
          <!-- {{expendTime}} -->
          <li class="fr">
            <el-button type="primary" size="mini" @click="submitTestpaper" :disabled="isRead">提交试卷</el-button>
          </li>
        </ul>
      </div>

      <div class="test-content">
        <!-- 题目内容 -->
        <div class="topics">
          <div class="topic" v-for="(topics, index) in sortedTopics" :key="index">

            <div class="topicsType" v-if="topics.topic_content.length != 0 ">
              <h4>{{bigQuestionName_mixin(topics.topic_type,index)}}</h4><!-- 题目类型名称 -->

              <div class="topic-content" v-for="(t, index) in topics.topic_content" :key="index">
                <div class="_location"></div>
                <!-- 题目 -->
                <div class="question" :class="forbid_copy? 'forbid_copy':''">
                  <span class="question_nunber">{{ topicNavIndex_mixin(topics.topic_type,index) }}、</span>
                  {{ t.question }}
                  <span class="score">({{ t.score }}分)</span>
                </div>

                <!-- 单选题 -->
                <div class="radio" v-if="t.topic_type==0">
                  <el-radio v-for="(item, index) in t.choice" :key="index" v-model="t.user_answer" :label="item" :disabled="isRead">
                    {{String.fromCharCode(65+index)}}、{{ item }}
                  </el-radio>
                  <!-- {{ t.user_answer }} -->
                </div>

                <!-- 多选题 -->
                <div class="checkbox" v-if="t.topic_type == 1">
                  <el-checkbox-group v-model="t.user_answer">
                    <el-checkbox :label="item" v-for="(item, index) in t.choice" :key="index" :disabled="isRead">
                      {{String.fromCharCode(65+index)}}、{{ item }}
                    </el-checkbox>
                  </el-checkbox-group>
                  <!-- {{ t.user_answer }} -->
                </div>

                <!-- 判断题 -->
                <div class="TrueOrFalse" v-if="t.topic_type == 2">
                  <el-radio v-model="t.user_answer" label="true" :disabled="isRead">正确</el-radio>
                  <el-radio v-model="t.user_answer" label="false" :disabled="isRead">错误</el-radio>
                  <!-- {{ t.user_answer }} -->
                </div>

                <!-- 填空题 -->
                <div class="fillInBlank" v-if="t.topic_type == 3">
                  <div v-for="(q, index) in t.correct_answer" :key="index">
                    <el-input type="textarea" autosize placeholder="请回答" :disabled="isRead" v-model="t.user_answer[index]">
                    </el-input>
                  </div>
                  <!-- {{ t.user_answer }} -->
                </div>

                <!-- 简答题 -->
                <div class="text" v-if="t.topic_type == 4">
                  <el-input type="textarea" v-model="t.user_answer" :autosize="{ minRows: 3, maxRows: 10 }" placeholder="请回答" :disabled="isRead">
                  </el-input>
                  <!-- {{ t.user_answer }} -->
                </div>

              </div>
            </div>

          </div>
        </div>

        <!-- 题目导航 -->
        <div class="topic-nav " :class="isFixed?'isFixed':''" :style="topic_nav_style">
          <div class="topic-nav-describe">
            <span class="topic-nav-but hasAnswer"> </span> 已答
            <span class="space"></span>
            <span class="topic-nav-but "> </span> 未答
          </div>

          <div v-for="(topics, Topics_index) in sortedTopics" :key="Topics_index">

            <div class="topic-nav-item" v-if="topics.topic_content.length != 0">
              <div class="nav-title">{{topicTypeName_mixin(topics.topic_type)}}</div>

              <span class="topic-nav-button" @click="topicNav(topics.topic_type,index)" v-for="(item , index) in topics.topic_content" :key="index" :class="emptyAnswer(item.user_answer) ?'':'hasAnswer'">
                {{topicNavIndex_mixin(topics.topic_type,index)}}
              </span>
            </div>

          </div>
        </div>

      </div>

      <div class="back-top" @click="backTop_mixin()">
        <i class="el-icon-arrow-up"></i>
      </div>

    </div>

  </div>
</template>

<script type="text/javascript">
import "../assets/less/testPaper.less";
import testPaperMixin from "../mixins/testPaper-mixin";

export default {
  name: "TestPaperStu",
  mixins: [testPaperMixin],
  data() {
    return {
      //按题目类型分类好的题目数据
      //题目类型==>  0:单选题  1:多选题  2:判断题  3:填空题  4:简答题
      sortedTopics: [
        { topic_type: 0, topic_content: [] },
        { topic_type: 1, topic_content: [] },
        { topic_type: 2, topic_content: [] },
        { topic_type: 3, topic_content: [] },
        { topic_type: 4, topic_content: [] },
      ],
      //试卷数据
      testData: {
        testPaper: {
          topic: [],
          subject: {},
        },
        classes: {
          creator: {},
        },
      },
      remainTime: "00:00:00", //考试剩余时间
      expendTime: 0, //考试用时(秒)
      isRead: false, //是否为只读模式
      forbid_copy: false, //是否禁止复制文本
      //侧导航栏是否悬浮
      isFixed: false,
      topic_nav_style: "top:0px",
    };
  },

  created() {
    this.getTestPaperData();
  },

  mounted() {
    // 监听滚动事件，然后用handleScroll这个方法进行相应的处理
    window.addEventListener("scroll", this.handleScroll);
  },

  methods: {
    //提交试卷
    submitTestpaper() {
      var topic = [];
      console.log(this.testData.testPaper.topic);
      for (let i = 0; i < this.testData.testPaper.topic.length; i++) {
        var item = this.testData.testPaper.topic[i];
        //处理多选/填空答案
        if (item.topic_type == 1 || item.topic_type == 3) {
          if (item.user_answer instanceof Array) {
            var user_answer = "";
            item.user_answer.forEach((c) => {
              user_answer += c + "\n";
            });
            item.user_answer = user_answer.slice(0, -1);
          }
        }
        topic.push({
          t_id: item.t_id,
          tp_id: this.testData.tp_id,
          user_answer: item.user_answer,
        });
      }

      console.log(topic);

      var request = {
        token: localStorage.getItem("_token"),
        c_id: this.testData.c_id,
        userTopics: topic,
        date: this.getNowFormatDate("yyyy-MM-dd hh:mm:ss"),
        time: this.expendTime,
      };
      request = JSON.stringify(request);
      this.$axios({
        method: "post",
        url: "/submitTestPaper",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        data: request,
      })
        .then((result) => {
          console.log("result ==> ", result);
          if (result.data.code == 200) {
            this.$message.success(result.data.msg);
          } else {
            this.$message.error(result.data.msg);
          }
        })
        .catch((err) => {
          console.log("err ==> ", err);
        });
    },

    //获取试卷数据
    getTestPaperData() {
      this.$axios({
        method: "get",
        url: "/getTestPaper",
        params: {
          token: localStorage.getItem("_token"),
          tp_id: this.$route.params.tp_id,
          c_id: this.$route.params.c_id,
        },
      })
        .then((result) => {
          console.log("result.data ==> ", result.data);

          if (result.data.code == 200) {
            this.processTestPaperData(result.data.data)
          } else {
            this.$message.error(result.data.msg);
            return;
          }

 
        })
        .catch((err) => {
          console.log("err ==> ", err);
        });
    },

    //处理试卷的题目数据
    processTestPaperData(testData) {
          /* 判断试卷是否打乱题目顺序 */
          if (testData.testPaper.disrupt_order == 1) {
            testData.testPaper.topic.sort(function(){
              return Math.random() > 0.5 ? -1:1
            })
          }

          /* 判断试卷是否允许复制文本 */
          if (testData.testPaper.permit_copy == 0) {
            this.forbid_copy = true;
          } else if (testData.testPaper.permit_copy == 1) {
            this.forbid_copy = false;
          }

          /* 处理试卷的题目数据 */
          testData.testPaper.topic.forEach((item) => {
            //按换行符分割字符串
            item.choice = item.choice.split(/[\n]/g);
            item.correct_answer = item.correct_answer.split(/[\n]/g);
            //添加用户答案
            if (item.topic_type == 1 || item.topic_type == 3) {
              item.user_answer = [];
            } else {
              item.user_answer = "";
            }
          });

          /* 判断用户是否已经完成试卷 */
          if (
            testData.testPaper.userTopic == null &&
            testData.testPaper.userGrade == null
          ) {
            console.log("开始考试");
            this.isRead = false;
          } else {
            console.log("查看试卷");
            this.isRead = true;
            //处理用户答案数据
            testData.testPaper.userTopic.forEach((item, index) => {
              //按换行符分割字符串
              if (item.user_answer.indexOf("\n") != -1) {
                item.user_answer = item.user_answer.split(/[\n]/g);
              }

              testData.testPaper.topic[index].user_answer = item.user_answer;
              // console.log(item.user_answer);
            });
            //根据题目id写入用户答案
          }

          this.testData = testData;
          console.log("this.testData ==> ", this.testData);

          //判断考试是否已经结束
          var nowDate = new Date().getTime();
          var deadline = testData.deadline;
          console.log('deadline',testData);
          var deadlineDate = new Date(
            Date.parse(deadline.replace(/-/g, "/"))
          ).getTime();
          if (nowDate < deadlineDate) {
            //开始计时
            console.log('开始计时');
            this.remainTimer();
          } else {
            this.isRead = true;
          }

          

          //按题目类型分类并保存
          var topics = this.testData.testPaper.topic;
          var topicsIndex = 1;
          for (let i = 0; i < topics.length; i++) {
            for (let item of this.sortedTopics) {
              if (topics[i].topic_type == item.topic_type) {
                //添加
                topics[i].index = topicsIndex++;
                item.topic_content.push(topics[i]);
              }
            }
          }
    },

    //计算剩余时间
    remainTimer() {
      var time = this.testData.testPaper.time * 60;
      var timer = setInterval(() => {
        this.remainTime = this.computateTime(time);
        time--;
        this.expendTime++;
        if (time < 0) {
          clearInterval(timer);
          this.$message("考试结束");
        }
      }, 1000);
    },

    //格式化考试剩余时间
    computateTime(time) {
      var sec = "00";
      var minute = "00";
      var hour = "00";

      if (time >= 0) {
        sec = time % 60;
        if (sec < 10) {
          sec = "0" + sec;
        }
      }
      if (time / 60 >= 0) {
        minute = parseInt((time / 60) % 60);
        if (minute < 10) {
          minute = "0" + minute;
        }
      }
      if (time / 60 / 60 >= 0) {
        hour = parseInt((time / 60 / 60) % 60);
        if (hour < 10) {
          hour = "0" + hour;
        }
      }
      return hour + ":" + minute + ":" + sec;
    },

    //滚动事件
    handleScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop; // 滚动条偏移量
      if (scrollTop > 154) {
        this.topic_nav_style = "top:" + (scrollTop + 62) + "px";
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },

    //点击题号定位到题目位置
    topicNav(type,index) {
      var i = this.topicNavIndex_mixin(type,index);
      console.log(i);
      document
        .getElementsByClassName("_location")
        [i - 1].scrollIntoView({ behavior: "smooth", block: "start" });
    },

    //判断回答是否为空
    emptyAnswer(str) {
      if (typeof str == "object") {
        if (str.join("") == "") {
          return true;
        }
      }
      if (str.length == 0) {
        return true;
      }
      return false;
    },
  },
};
</script>

