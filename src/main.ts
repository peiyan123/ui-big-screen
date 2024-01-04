import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import 'element-plus/dist/index.css'
import '../public/index.css'
import ElementPlus from 'element-plus'
import Websocket from "./utils/websocket"
import { setupStore } from '@/store'
import './assets/fonts/iconfont.css'
import i18n from "@/i18n/index";

const onMessageList: Array<any> = []; // 声明一个全局变量来收集onMessage列表，因为在不同的页面可能会有不同的处理

createApp(App).provide("onMessageList", onMessageList).use(ElementPlus).use(i18n).use(setupStore).use(router).mount('#app')
const onMessage = (event: any) => {
  // 遍历onMessage集合并触发
  onMessageList.forEach(f => {
    f.call(null, event);
  })
}

// console.log(process.env.NODE_ENV)
// setTimeout(() => {
//   Websocket(onMessage);
// }, 1000)
