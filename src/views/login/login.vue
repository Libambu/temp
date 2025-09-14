<template>
  <div class="container" :class="{ 'right-panel-active': isSignUp }" id="container">
    <div class="form-container sign-up-container">
      <!-- 注册 -->
      <form @submit.prevent>
        <h1>用户注册</h1>
        <div class="social-container">
         <a href="#" class="social"><img src="@/assets/img/QQ.png" alt="QQ" style="width:24px;height:24px;"></a>
         <a href="#" class="social"><img src="@/assets/img/wx.png" alt="微信" style="width:24px;height:24px;"></a>
         <a href="#" class="social"><img src="@/assets/img/weibo.png" alt="微博" style="width:24px;height:24px;"></a>
         <a href="#" class="social"><img src="@/assets/img/github.png" alt="GitHub" style="width:24px;height:24px;"></a>
        </div>
        <span>您可以选择以上几种方式注册账户</span>
        <input type="text" placeholder="邮箱" v-model="register.email">
        <input type="password" placeholder="密码" v-model="register.password">
        <input type="text" placeholder="昵称" v-model="register.nickName">
        <div style="margin: 10px 0;">
            <input type="text" v-model="checkCodeInput" placeholder="请输入验证码" style="width: 120px; margin-left: 10px; margin-right: 10px;" />
            <img :src="img" alt="验证码" width="150" height="40" style="vertical-align: middle;cursor:pointer;margin-left: 10px" @click.stop="getCheckCode" />
        </div>
        <button @click.prevent="Postregister">注册</button>
      </form>
    </div>
    <!-- 登录 -->
    <div class="form-container sign-in-container">
      <form @submit.prevent>
        <h1>用户登录</h1>
        <div class="social-container">
            <a href="#" class="social"><img src="@/assets/img/QQ.png" alt="QQ" style="width:24px;height:24px;"></a>
            <a href="#" class="social"><img src="@/assets/img/wx.png" alt="微信" style="width:24px;height:24px;"></a>
            <a href="#" class="social"><img src="@/assets/img/weibo.png" alt="微博" style="width:24px;height:24px;"></a>
            <a href="#" class="social"><img src="@/assets/img/github.png" alt="GitHub" style="width:24px;height:24px;"></a>
        </div>
        <input type="text" placeholder="邮箱" v-model="login.email">
        <input type="password" placeholder="密码" v-model="login.password">
        <div style="margin: 10px 0;">
            <input type="text" v-model="checkCodeInput" placeholder="请输入验证码" style="width: 100px; margin-left: 10px;" />
            <img :src="img" alt="验证码" width="150" height="40" style="vertical-align: middle;cursor:pointer;" @click.stop="getCheckCode" />
        </div>
        <a href="#">忘记密码？</a>
        <button @click.prevent="Postlogin">登录</button>
      </form>
    </div>
    <!-- 侧边栏内容 -->
    <div class="overlay-container">
      <div class="overlay">
        <div class="overlay-panel overlay-left">
          <h1>已有账号？</h1>
          <p>点我快快进行登录！</p>
          <button class="ghost" @click="isSignUp = false" id="signIn">登录</button>
        </div>
        <div class="overlay-panel overlay-right">
          <h1>没有账号？</h1>
          <p>点击去注册一个属于你的账号！</p>
          <button class="ghost" @click="isSignUp = true" id="signUp">注册</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import store from '@/store';
    import axios from 'axios';
    import Cookies from 'js-cookie'
    export default {
        name: "getInfo",
        data(){

    return {
      isSignUp: false,
      img: "",
      checkCodeKey: "",
      checkCodeInput: "",
      login: {
        email: "",
        password: "",
        businsessName: ""
      },
      register: {
        email: "",
        password: "",
        nickName: ""
      }
    }
        },
        methods:{
            Postlogin(){
                axios.post('/elm/admin/Account/login',null, {
                    params: {
                        email: this.login.email,
                        password: this.login.password,
                        checkCodeKey: this.checkCodeKey,
                        checkCode: this.checkCodeInput
                    }
                }).then(res => {
                    // 假设后端返回 { code: 200 } 表示成功
                    if(res.data.code === 200){
                        console.log(res.data);
                        this.$store.commit('setBusinessName', res.data.data.businessName);
                        localStorage.setItem('adminToken', res.data.data.token);
                        Cookies.set('adminToken', res.data.data.token, { expires: 7, path: '/' })
                        alert(store.state.businessName + '，欢迎您！');
                        this.$router.push('/home');
                        
                    }else{
                        alert(res.data.info);
                    }
                }).catch(err => {
                    alert('登录失败，服务器好像有点问题');
                    console.log(err);
                })
            },
            Postregister(){
                axios.post('/elm/admin/Account/register', null, {
                    params: {
                        email: this.register.email,
                        nickName: this.register.nickName,
                        password: this.register.password,
                        checkCodeKey: this.checkCodeKey,
                        checkCode: this.checkCodeInput
                    }
                }).then(res => {
                    if(res.data.code === 200){
                        console.log(res.data);
                        alert('注册成功');
                    }else{
                        alert(res.data.info);
                    }
                }).catch(err => {
                    alert('注册失败');
                    console.log(err);
                })
            },
            getCheckCode(){
                axios.get('/elm/admin/Account/getCheckCode',{
                }).then(res =>{
                    this.img = res.data.data.checkCode;
                    this.checkCodeKey = res.data.data.checkCodeKey;
                    console.log(res.data);
                }).catch(err =>{
                    console.log(err);
                })
            }
        },
        mounted() {
            this.getCheckCode(); // 页面加载时自动获取验证码
        }
    }
</script>

<style scoped>
@import "../../assets/style.css";
@import "../../assets/iconfont/iconfont.css";
</style>
