import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw
} from 'vue-router'
import Home from '@/view/home.vue'
const routes: Array<RouteRecordRaw> = [

	{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component:() => import('@/view/login.vue')
  },
  {
    path: '/config',
    name: 'Config',
    component:() => import('@/view/config.vue')
  },
  {
    path: '/meetting-room',
    name: 'Meetting',
    component:() => import('@/view/meetting.vue')
  },
  {
    path: '/datareport/report',
    name: 'Report',
    component:() => import('@/view/report.vue')
  },
  {
    path: '/shared',
    name: 'Shared',
    component:() => import('@/view/shared.vue')
  },
  {
    path: '/toiletInfo',
    name: 'ToiletInfo',
    component:() => import('@/view/toiletInfo.vue')
  },
]

const router = createRouter({
	history: createWebHashHistory(),
  routes
})

export default router