<template>
  <div class="login">

    <div class="info-left">
      <img src="../assets/images/login-image3.png" alt="操场">
    </div>


    <div class="info">
      <p>快乐屋</p>
      <!-- {{$store.state.user_id}} -->
      <el-form :model="form" status-icon :rules="rules" ref="loginForm" label-width="auto">
        <el-form-item label="账号" prop="name">
          <el-input v-model="form.name" placeholder="请输入邮箱或手机号码"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password"  v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <div class="forget-password" :underline="false">忘记密码?</div>

        <el-button type="primary" class="login-but" @click="login('loginForm')">登录</el-button>
        <el-button type="primary" class="register-but1" @click="goRouter('register')">注册</el-button>

        <img class="login-image1" src="../assets/images/login-image1.png" alt="学习1">
        <img class="login-image2" src="../assets/images/login-image2.png" alt="学习2">
      </el-form>
    </div>
  </div>
</template>

<script>
import "../assets/less/login.less"
import ElementUI from 'element-ui';
export default {
  name: "Login",
  data() {
    return {
      form: {
        name: '762489117@qq.com',
        password:'admin',
      },
      rules:{
          name:[
              { required: true, message: '请输入账号名称', trigger: 'blur' },
          ],
          password:[
              { required: true, message: '请输入密码', trigger: 'blur' },
          ],
      }
        
    };
  },
  created(){

  },

  methods:{
    //路由跳转
    goRouter(path){
      this.$router.push(path)
    },

    //表单提交-----登录
    login(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 处理请求参数
            var request={
              name:this.form.name,
              password:this.form.password
            }
            this.$http.post('/login',request).then(res =>{
              if(res.code==200){
                var data = res.data;
                //登录成功跳转
                localStorage.setItem('_token', data.token);
                ElementUI.Message.success("登录成功!")
                this.goRouter({name:"Home"})
              }
            })        
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
  }
};
</script>

