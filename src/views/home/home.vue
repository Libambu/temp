<template>
  <div class="layout">
    <!-- 顶部通栏导航 -->
    <header class="top-bar">
      <div class="logo" style="font-size: 30px;">饱了吗商家管理端</div>
      <!--用户退出-->
      <div style="font-size: 20px; ">{{ $store.state.businessName }}</div>
      <span class="logout-btn" @click="handleLogout" style=" ">退出登录</span>
    </header>

    <!-- 下方主体区：左侧边栏 + 右侧内容 -->
    <div class="main-body">
      <!-- 左侧边栏 -->
      <aside class="side-bar">
        <router-link to="/home/info" class="nav-item" active-class="active">我的信息</router-link>
        <router-link to="/home/category" class="nav-item" active-class="active">分类管理</router-link>
        <router-link to="/home/dish" class="nav-item" active-class="active">菜品管理</router-link>
        <router-link to="/home/order" class="nav-item" active-class="active">订单管理</router-link>
        <router-link to="/home/statistics" class="nav-item" active-class="active">数据统计</router-link>

      </aside>

      <!-- 右侧内容区（嵌套路由） -->
      <main class="content">
        <div id="main">
            <router-view/>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';



export default {
    name: 'HomeView',
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
.layout {
  height: 100vh;
  min-width: 1400px;
  display: flex;
  flex-direction: column;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  /* 关键：首次渲染时先让浏览器认为布局失效 */
  opacity: .999;
}
/* 顶部通栏 */
.top-bar {
  height: 80px;
  width: 100%;
  background: #409eff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  font-size: 18px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .08);
  flex-shrink: 0;
}

/* 下方主体区 */
.main-body {
  flex: 1;
  display: flex;
  overflow: hidden;
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
  height: 60px;
  line-height: 48px;
  padding: 10px 32px;
  font-size: 16px;
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
  min-height: 100%;
  background: #f5f7fa;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .06);
  padding: 24px;
}
.logout-btn {
  margin-left: 16px;
  cursor: pointer;
  color: #fff;
  font-size: 16px;
}
.logout-btn:hover {
  text-decoration: underline;
}
</style>