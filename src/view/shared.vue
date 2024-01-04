<template>
  <div>
    <SharedOffice :officeInfo="officeInfo"></SharedOffice>
  </div>
</template>
<script lang="ts">
import { useUserStore } from '@/store/moudules/appStore'
import { post } from '@/utils/axios'
import moment from 'moment'
import { defineComponent, onMounted, ref } from 'vue'
import SharedOffice from './bigScreencomponents/components/sharedOffice.vue'
export default defineComponent({
  components: {
    SharedOffice,
  },
  setup() {
    const loginInfo = {
      username: 'jinma@qq.com',
      password: '123456',
    }
    const momentStr = ref('')
    const userStore = useUserStore()
    const officeInfo = ref<any>([]) // 共享办公工位
    let socket: WebSocket
    onMounted(() => {
      initData()
    })
    function initData() {
      // 获取tokan
      post('/auth/login', loginInfo).then((res: any) => {
        userStore.setToken(res.token)
        localStorage.setItem('token', res.token)
        const socketUrl =
          'ws://ib.thundercomm.com/api/ws/plugins/telemetry?token=' +
          userStore.getToken
        // let socketUrl =
        //   'ws://10.0.79.130:8888/api/ws/plugins/telemetry?token=' +
        //   userStore.getToken
        momentStr.value = moment().format('YYYYMMDD')
        socket = new WebSocket(socketUrl)
        socket.onopen = function (event) {
          sendWSRequest()
        }
        socket.onerror = function (event) {
          console.log('WebSocket:发生错误', event)
          setTimeout(() => {
            socket.close()
          }, 4000)
        }
        socket.onclose = function (event) {
          console.log('WebSocket:发生关闭', event)
          setTimeout(() => {
            initData()
          }, 4000)
        }
      })
    }
    function sendWSRequest() {
      let params = {
        type: 'SHARED_STATION_REQUEST',
        body: { nowDate: momentStr.value },
        wsType: 'jinma',
      }
      if (socket.readyState === 1) {
        socket.send(JSON.stringify(params))
        onMessage()
      }
    }
    function onMessage() {
      socket.onmessage = function (res: any) {
        const data = JSON.parse(res.data)
        // console.log(JSON.stringify(data.body))
        if (JSON.stringify(data.body) !== '{}') {
          if (data.type === 'SHARED_STATION_RESPONSE') {
            // 会议室信息
            delete data.body.timestamp
            if (JSON.stringify(officeInfo.value) != JSON.stringify(data.body)) {
              officeInfo.value = data.body
            }
          }
        }
      }
    }
    return {
      officeInfo,
    }
  },
})
</script>
<style lang="less" scoped>
</style>