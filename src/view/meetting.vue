<template>
  <div class="meeting-contion">
    <MeetingRoom v-loading="loadingStatue"
                 element-loading-text="拼命加载中"
                 :meetingInfo="meetingInfo"></MeetingRoom>
  </div>
</template>
<script lang="ts">
import { useUserStore } from '@/store/moudules/appStore'
import { get, post } from '@/utils/axios'
import moment from 'moment'
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import MeetingRoom from './bigScreencomponents/components/meetingRoom.vue'
export default defineComponent({
  components: {
    MeetingRoom,
  },
  setup() {
    const userStore = useUserStore()
    const momentStr = ref('')
    const meetingInfo = ref<any>([]) // 会议室
    const loginInfo = {
      username: 'jinma@qq.com',
      password: '123456',
    }
    const loadingStatue = ref(true)
    let socket: WebSocket
    onMounted(() => {
      initData()
    })
    function initData() {
      // 获取tokan
      post('/auth/login', loginInfo).then((res: any) => {
        userStore.setToken(res.token)
        localStorage.setItem('token', res.token)
        // 初始化会议室数据
        get('/aiot/screen/meetingRoom/rooms/getInitRoom').then((res: any) => {
          meetingInfo.value = res.data
          loadingStatue.value = false
        })
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
        type: 'MEETING_ROOM_REQUEST',
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
          if (data.type === 'MEETING_ROOM_RESPONSE') {
            // 会议室信息
            delete data.body.timestamp
            if (
              JSON.stringify(meetingInfo.value) != JSON.stringify(data.body)
            ) {
              meetingInfo.value = data.body
            }
          }
        }
      }
    }
    onBeforeUnmount(() => {
      socket.close()
    })
    return {
      meetingInfo,
      momentStr,
      sendWSRequest,
      onMessage,
      loadingStatue,
    }
  },
})
</script>
<style lang="less" scoped>
.meeting-contion {
  background-color: #0b1f37;
}
/deep/.el-loading-mask {
  background-color: #0b1f37 !important;
  margin-top: 150px !important;
}
</style>