!<template>
  <div class="markTestPaper testPaper">
    <div class="w">
      <!-- 考试信息 -->
      <div class="title">
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
          <li class="user-info">答题人: {{ testData.testPaper.userGrade.userName }}</li>
          <li class="user-info">答题人Id: {{ testData.testPaper.userGrade.userNumber }}</li>
          <li class="user-info">自动评改得分: {{ testData.testPaper.userGrade.gradeAuto }} 分</li>
          <li class="user-info">最终得分: {{ testData.testPaper.userGrade.grade }} 分</li>
          <li class="fr">
            <el-button type="primary" size="mini" @click="submitTestpaper" >提交试卷</el-button>
          </li>
        </ul>
      </div>

      <div class="title fixed" v-if="isFixed">
        <ul>
          <li class="test-info"><strong class="testName">{{ testData.testPaper.name }}</strong></li>
          <li class="test-info">总分: {{ testData.testPaper.total_score }} 分</li>
          <li class="test-info">答题人: {{ testData.testPaper.userGrade.userName }}</li>
          <li class="test-info">最终得分: {{ testData.testPaper.userGrade.grade }} 分</li>
          <li class="fr">
            <el-button type="primary" size="mini" @click="submitTestpaper" >提交试卷</el-button>
          </li>
        </ul>
      </div>

      <div class="test-content">
        <!-- 题目内容 -->
        <div class="topics">
          <div class="topic" v-for="(topics, index) in sortedTopics" :key="index">

            <div class="topicsType" v-if="topics.topic_content.length != 0 ">
              <h4>{{bigQuestionName_mixin(topics.topic_type,index)}}</h4><!-- 题目类型名称 -->
              <ul>
                <li class="topic-content" v-for="(t, index) in topics.topic_content" :key="index">
                  <div class="_location"></div>
                  <!-- 题目 -->
                  <div class="left">
                    <div class="question">
                      <span class="question_nunber">{{ topicNavIndex_mixin(topics.topic_type,index) }}、</span>
                      {{ t.question }}
                      <span class="score">({{ t.score }}分)</span>
                    </div>

                    <!-- 单选题 -->
                    <div class="radio" v-if="t.topic_type==0">
                      <el-radio v-for="(item, index) in t.choice" :key="index" :class="item == t.correct_answer? 'correct':'error'" v-model="t.user_answer" :label="item" :disabled="isRead">
                        {{t.correct_answer}}
                        {{String.fromCharCode(65+index)}}、{{ item }}
                      </el-radio>
                    </div>

                    <!-- 多选题 -->
                    <div class="checkbox" v-if="t.topic_type == 1">
                      <el-checkbox-group v-model="t.user_answer">
                        <el-checkbox :label="item" v-for="(item, index) in t.choice" :key="index" :disabled="isRead">
                          {{String.fromCharCode(65+index)}}、{{ item }}
                        </el-checkbox>
                      </el-checkbox-group>
                    </div>

                    <!-- 判断题 -->
                    <div class="TrueOrFalse" v-if="t.topic_type == 2">
                      <el-radio v-model="t.user_answer" label="true" :class="'true' == t.correct_answer? 'correct':'error'" :disabled="isRead">正确</el-radio>
                      <el-radio v-model="t.user_answer" label="false" :class="'false' == t.correct_answer? 'correct':'error'" :disabled="isRead">错误</el-radio>
                    </div>

                    <!-- 填空题 -->
                    <div class="fillInBlank" v-if="t.topic_type == 3">
                      <div v-for="(q, index) in t.correct_answer" :key="index">
                        <el-input type="textarea" autosize placeholder="(学生没有回答)" :disabled="isRead" v-model="t.user_answer[index]">
                        </el-input>
                      </div>
                    </div>

                    <!-- 简答题 -->
                    <div class="text" v-if="t.topic_type == 4">
                      <el-input type="textarea" v-model="t.user_answer" :autosize="{ minRows: 3, maxRows: 10 }" placeholder="(学生没有回答)" :disabled="isRead">
                      </el-input>
                    </div>

                    <div v-if="t.topic_type == 3||t.topic_type == 4" class="correct_answer">参考答案: {{t.correct_answer}}</div>
                  </div>
                  <div class="right">
                    <div v-if="t.topic_type == 0||t.topic_type == 1||t.topic_type == 2">
                      <div class="correct_answer">参考答案: {{correctOptions(t)}}</div>
                      <div class="userScore">得分: {{t.userScore}} 分</div>
                    </div>
                    <div v-else>
                      <div class="userScore">
                        得分:
                        <el-input-number v-model="t.userScore" controls-position="right" :min="0" :max="t.score"></el-input-number>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>

        <!-- 题目导航 -->
        <div class="topic-nav " :class="isFixed?'isFixed':''" :style="topic_nav_style">
          <div class="topic-nav-describe">
            <span class="topic-nav-but correct"> </span> 正确
            <span class="space"></span>
            <span class="topic-nav-but error"> </span> 错误
          </div>

          <div v-for="(topics, Topics_index) in sortedTopics" :key="Topics_index">

            <div class="topic-nav-item" v-if="topics.topic_content.length != 0">
              <div class="nav-title">{{topicTypeName_mixin(topics.topic_type)}}</div>

              <span class="topic-nav-button" @click="topicNav(topics.topic_type,index)" v-for="(item , index) in topics.topic_content" :key="index" :class="isMarkTopic(item)">
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

<script>
import "../assets/less/testPaper.less";
import testPaperMixin from "../mixins/testPaper-mixin";
import "../assets/less/markTestPaper.less";

export default {
  name: "MarkTestPaper",
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
          userGrade: {},
        },
        classes: {
          creator: {},
        },
      },
      remainTime: "00:00:00", //考试剩余时间
      expendTime: 0, //考试用时(秒)
      isRead: true, //是否为只读模式
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
        url: "/getTestPaperMark",
        params: {
          token: localStorage.getItem("_token"),
          tp_id: this.$route.params.tp_id,
          c_id: this.$route.params.c_id,
          u_id: 2,
        },
      })
        .then((result) => {
          console.log("result.data ==> ", result.data);

          if (result.data.code == 200) {
            this.processTestPaperData(result.data.data);
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
      testData.testPaper.topic.forEach((item, index) => {
        //按换行符分割字符串
        item.choice = item.choice.split(/[\n]/g);
        item.correct_answer = item.correct_answer.split(/[\n]/g);
        //添加空用户答案
        if (item.topic_type == 1 || item.topic_type == 3) {
          item.user_answer = [];
        } else {
          item.user_answer = "";
        }
        //添加教师是否批改判断
        item.status = testData.testPaper.userTopic[index].status;
        //添加评改分数
        item.userScore = testData.testPaper.userTopic[index].score;
      });

      /* 判断用户是否已经完成试卷 */
      if (
        testData.testPaper.userTopic == null &&
        testData.testPaper.userGrade == null
      ) {
        console.log("用户未完成试卷");
      } else {
        console.log("查看试卷");
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
    topicNav(type, index) {
      var i = this.topicNavIndex_mixin(type, index);
      console.log(i);
      document
        .getElementsByClassName("_location")
        [i - 1].scrollIntoView({ behavior: "smooth", block: "start" });
    },

    //判断题目是否批改与正确
    isMarkTopic(topic) {
      //单选题与判断题
      if (topic.topic_type == 0 || topic.topic_type == 2) {
        if (topic.user_answer == topic.correct_answer[0]) {
          return "correct";
        } else {
          return "error";
        }
      }
      //多选题
      if (topic.topic_type == 1) {
        var correctNumber = 0;
        for (let i = 0; i < topic.correct_answer.length; i++) {
          for (let j = 0; j < topic.user_answer.length; j++) {
            if (topic.correct_answer[i] == topic.user_answer[j]) {
              correctNumber++;
              continue;
            }
          }
        }
        if (correctNumber == topic.correct_answer.length) {
          return "correct";
        } else {
          return "error";
        }
      }
      //填空题与简答题
      if (this.testData.testPaper.auto_mack == 1) {
        //如果为自动评分
        var correctNumber = 0;
        for (let i = 0; i < topic.correct_answer.length; i++) {
          if (topic.correct_answer[i] == topic.user_answer[i]) {
            correctNumber++;
          }
        }
        if (correctNumber == topic.correct_answer.length) {
          return "correct";
        } else {
          return "error";
        }
      } else {
        if (topic.status == 1) return "correct";
        if (topic.status == 2) return "error";
      }
    },

    //正确选项参考答案选项字母化
    correctOptions(topic) {
      var correctOptions = "";
      switch (topic.topic_type) {
        case 0:
          for (let i = 0; i < topic.choice.length; i++) {
            if (topic.choice[i] == topic.correct_answer[0]) {
              correctOptions = String.fromCharCode(65 + i);
              break;
            }
          }
          break;

        case 1:
          for (let i = 0; i < topic.choice.length; i++) {
            for (let j = 0; j < topic.correct_answer.length; j++) {
              if (topic.choice[i] == topic.correct_answer[j]) {
                correctOptions += String.fromCharCode(65 + i);
                continue;
              }
            }
          }
          break;

        case 2:
          if (topic.correct_answer[0] == "true") {
            correctOptions = "正确";
          } else {
            correctOptions = "错误";
          }
          break;
      }

      return correctOptions;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>