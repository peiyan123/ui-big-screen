<template>
  <div>
    <ToiletOccupancy :occupancyInfo="occupancyInfo"></ToiletOccupancy>
  </div>
</template>
<script lang="ts">
import { useUserStore } from '@/store/moudules/appStore'
import { post } from '@/utils/axios'
import moment from 'moment'
import { defineComponent, onMounted, ref } from 'vue'
import ToiletOccupancy from './bigScreencomponents/components/toiletOccupancy.vue'
export default defineComponent({
  components: {
    ToiletOccupancy,
  },
  setup() {
    const loginInfo = {
      username: 'jinma@qq.com',
      password: '123456',
    }
    const momentStr = ref('')
    const userStore = useUserStore()
    const occupancyInfo = ref<any>({}) // 厕位占用情况
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
        type: 'TOILET_SEAT_REQUEST',
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
          if (data.type === 'TOILET_SEAT_RESPONSE') {
            if (
              JSON.stringify(occupancyInfo.value) != JSON.stringify(data.body)
            ) {
              occupancyInfo.value = data.body
            }
          }
        }
      }
    }
    return {
      occupancyInfo,
    }
  },
})
</script>
<style lang="less" scoped>
.container-border {
  border: none;
  margin-top: 30px;
}
</style>