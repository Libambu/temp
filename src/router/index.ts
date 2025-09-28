import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Cookies from 'js-cookie'
Vue.use(VueRouter)
const routes: Array<RouteConfig> = [

  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/',
    redirect: '/login' // 默认重定向到登录页
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/home/index.vue'),
    redirect: '/home/info',
    children:[
      {
        path: '/home/info',
        component: () => import( '../views/info/index.vue'),
      },
      {
        path: '/home/dish',
        component: () => import( '../views/dish/index.vue'),
      },
      {
        path: '/home/dish/dishInfo',
        component:() => import( '../views/dish/dishInfo.vue'),
      },
      {
        path: '/home/order',
        component: () => import( '../views/order/index.vue'),
      },
      {
        path: '/home/statistics',
        component: () => import( '../views/statistics/index.vue'),
      }
    ]
  }
]

const router = new VueRouter({
  routes
})



/* ===== 全局前置守卫 ===== */

router.beforeEach((to, from, next) => {
  const hasToken = Cookies.get('adminToken')        // 读登录凭证
  const whiteList = ['/login']                      // 白名单，无需登录

  if (hasToken) {                                   // 已登录
    if (to.path === '/login') {
      next('/home')                                 // 阻止重复进登录页
    } else {
      next()                                        // 放行
    }
  } else {                                          // 未登录
    if (whiteList.includes(to.path)) {
      next()                                        // 白名单直接过
    } else {
      next('/login?redirect=' + encodeURIComponent(to.fullPath)) // 其它一律打回登录
    }
  }
})


export default router

