import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "./",//打包路径
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')//设置别名
    }
  },
  server: {
    open: true,//启动项目自动弹出浏览器
    port: 4000,//启动端口
    host: '0.0.0.0', // 0.0.0.0设置手机端可以访问
    proxy: {
      '/api': {
        //target: 'http://10.4.13.44:8080/',	//实际请求地址
        target: 'http://ib.thundercomm.com/',
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  }
  // server: {
  //   port: 4000,//启动端口
  //   open: true,
  //   proxy: {
  //     // 跨域简单写法写法
  //     '/api': 'http://123.56.85.24:5000'//代理网址
  //   },
  //   cors: true
  // },
})
