<template>
  <el-container class="layout">
    <!-- 顶部通栏导航 -->
    <el-header style="height: 100px;width: 100%;">
      <i class="el-icon-platform-eleme" style="font-size: 40px;margin-right: 10px;"></i>
      <div class="logo" style="font-size: 30px;float: left;">饱了吗商家管理端</div>
      <!--用户退出-->
      <div style="font-size: 20px;position:absolute;right:200px">{{ businessName }}</div>
      <el-button type="text" @click="handleLogout" style="font-size: 25px;color: #fff;margin-left: auto;">退出登录</el-button>
    </el-header>

    <!-- 下方主体区：左侧边栏 + 右侧内容 -->
    <el-container class="main-body">
      <!-- 左侧边栏 -->
      <el-aside class="side-bar" >
        <router-link to="/home/info" class="nav-item el-icon-user" active-class="active"> 我的信息</router-link>
        <router-link to="/home/dish" class="nav-item el-icon-dish" active-class="active"> 菜品管理</router-link>
        <router-link to="/home/order" class="nav-item el-icon-s-order" active-class="active"> 订单管理</router-link>
        <router-link to="/home/statistics" class="nav-item el-icon-s-data" active-class="active"> 数据统计</router-link>

      </el-aside>

      <!-- 右侧内容区（嵌套路由） -->
      <el-main class="content">
        <div id="main">
            <router-view/>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';



export default {
    name: 'HomeView',
    data(){
      return{
        businessName : localStorage.getItem('BusinessName')
      }
    },
    mounted() {
    // 保险：强制浏览器重新计算布局
        this.$nextTick(() => {
        document.querySelector('.layout').style.display = 'flex';
    });
    },
    methods: {
      handleLogout() {
        axios({
          method:'get',
          url:'/elm/admin/Account/logout',
          headers:{
            'adminToken': localStorage.getItem('adminToken')
          }
        })
        // 清除本地存储的 token
        localStorage.removeItem('adminToken');
        Cookies.remove('adminToken', { path: '/' });
        // 清除 Vuex 中的用户信息
        this.$store.commit('setBusinessName', '');
        // 跳转到登录页面
        this.$router.push('/login');
      }
    }
}
</script>

<style scoped>
/* 整体布局 */
.layout{
  height: 950px;
  min-width: 1400px;
  display: flex;
  flex-direction: column;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  /* 关键：首次渲染时先让浏览器认为布局失效 */
  opacity: .999;
}
/* 顶部通栏 */
.el-header{
  background: #409eff;
  color: #fff;
  display: flex;
  align-items: center;
}

/* 下方主体区 */
.main-body {
  flex: 1;
  display: flex;
  overflow: auto;
}

/* 左侧边栏 */
.side-bar {
  width: 220px;
  background: #2b333f;
  padding: 24px 0;
  overflow-y: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-item {
  display: block;
  line-height:100px;
  font-size: 20px;
  text-align: center;
  color: #cfd3dc;
  text-decoration: none;
  border-radius: 6px;
  margin: 0 12px;
  transition: all .25s;
}
.nav-item:hover {
  background: rgba(255, 255, 255, .08);
}
.nav-item.active {
  background: #409eff;
  color: #fff;
  font-weight: 500;
}

/* 右侧内容区 */
.content {
  flex: 1;
  padding: 24px;
  background: #f5f7fa;
  overflow: auto;
}
#main {
  min-height: 700px;
  background: #f5f7fa;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .06);
  padding: 24px;
}

</style>