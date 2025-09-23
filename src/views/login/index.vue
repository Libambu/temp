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
                        localStorage.setItem('adminToken', res.data.data.token);
                        localStorage.setItem('BusinessName', res.data.data.businessName);
                        Cookies.set('adminToken', res.data.data.token, { expires: 7, path: '/' })
                        alert(res.data.data.businessName + '，欢迎您！');
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
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
body,html{
    font-family: Arial, Helvetica, sans-serif;
    /* 换上淡色背景 */
    background-color: #f8f8f8;
    /* 锁定背景 */
    background-attachment: fixed;
    /* 弹性布局 */
    display: flex;
    flex-direction: column; 
    justify-content: center;
    align-items: center;
    height: 100%;
    margin: 0 auto;
}
h1{
    margin: 0.2rem;
    font-size: 1.2rem;
}
p{
    font-size: 1rem;
    line-height: 1.5rem;
    /* 字体变淡 */
    font-weight: 100;
    margin: 1.2rem 0;
    letter-spacing: 0.1rem;
}
span{
    font-size: 0.8rem;
    margin: 1.2rem 0;
}
a{
    /* 淡黑色 */
    /* color: #333; */
    font-size: 1rem;
    text-decoration: none;
}
.container{
    position: relative;
    /* 白色 */
    background-color: #fff;
    /* 圆角程度 */
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),0 10px 10px rgba(0, 0, 0, 0.22);
    padding: 0.6rem;
    width: 50rem;
    height: 35rem;
    /* 溢出隐藏 */
    overflow: hidden;
    max-width: 100vw;
    min-width: 70vh;
    margin:auto;
    margin-top: 180px;
}
.form-container form{
    background-color: #fff;
    /* 弹性布局 */
    display: flex;
    flex-direction: column;
    padding: 0 1.8rem;
    height: 100%;
    /* 主轴方向上居中排列 */
    justify-content: center;
    /* 交叉轴方向上居中排列 */
    align-items: center;
} 
.social-container a{
    /* 图标颜色eee */
    border: 1px solid #eee;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;
    height: 1.8rem;
    width: 1.8rem;
}
.social-container a:hover{
    opacity: 0.8;
}
.form-container input{
    width: 100%;
    height: 2.2rem;
    text-indent: 1rem;
    /* 淡灰色 */
    border: 1px solid #ccc;
    /* 去掉边框上左右取消 */
    border-left: none;
    border-right: none;
    border-top: none;
    /* 点击边框消失 */
    outline:none;
    margin: 0.6rem 0;
}
.form-container button:active{
    /* 点击按钮缩小 */
    transform: scale(0.95,0.95);
}
.form-container button{
    padding: 0.4rem 1rem;
    /* 按键比较适配的颜色 */
    background-color: #417dff;
    color: white;
    border: 1px solid #fff;
    outline: none;
    /* 鼠标放上去变小手 */
    cursor: pointer;
    width: 5rem;
    border-radius: 8px;
    transition: all 100ms ease-in;
    margin: 0.6rem 0;
    padding: 0.5rem 0;
    font-size: 0.8rem;
}
button#send_code{
    width: 100%;
}
button.ghost{
    background: transparent;
    border-color: #fff;
    border:1px solid #fff;
    outline: none;
    cursor: pointer;
    width: 5rem;
    border-radius: 8px;
    transition: all 100ms ease-in;
    margin: 0.6rem 0;
    padding: 0.5rem 0;
    color: white;
    font-size: 0.6rem;
}
button.ghost:active{
    transform: scale(0.95,0.95);
}
.form-container{
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.5s ease-in;
}
.sign-in-container{
    left: 0;
    width:50%;
    z-index: 2;
}
.sign-up-container{
    left: 0;
    width:50%;
    opacity: 0;
    z-index: 1;
}
.overlay{
    background-color: #417dff;
    width: 200%;
    height: 100%;
    position: relative;
    left: -100%;
    transition: all 0.6s ease-in-out;
    color: white;
}
.overlay-container{
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: all 0.6s ease-in-out;
    z-index: 99;
}
.overlay-panel{
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 100%;
    padding: 0 2.2rem;
}
.overlay-right{
    right: 0;
}
.container.right-panel-active .overlay-container{
    transform: translateX(-100%);
}
.container.right-panel-active .sign-in-container{
    transform: translateX(100%);
}
.container.right-panel-active .sign-up-container{
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    transition: all 0.6s ease-in-out;
}
.container.right-panel-active .overlay{
    transform: translateX(50%);
}
.container.right-panel-active .overlay-left{
    transform: translateX(0);
    transition: all 0.6s ease-in-out;
}
.container.right-panel-active .overlay-right{
    transform: translateX(20%);
    transition: all 0.6s ease-in-out;
}
</style>
