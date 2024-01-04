<template>
  <div id="big_jinma"
       v-loading="loadingStatue"
       element-loading-text="登陆中，请稍等..."
       element-loading-background="rgba(0, 0, 0, 0.8)"
       class="screenContainer">
    <div class="screen-header">
      <ScreenHeader @resetToken="resetToken"></ScreenHeader>
    </div>
    <div class="row row-1">
      <OutWeather :weatherInfo="weatherInfo"></OutWeather>
      <OfficeAirQuality :airQualityInfo="airQualityInfo"></OfficeAirQuality>
      <SharedOffice :officeInfo="officeInfo"></SharedOffice>
    </div>
    <div class="row row-2">
      <MeetingRoom :meetingInfo="meetingInfo"></MeetingRoom>
      <ToiletOccupancy :occupancyInfo="occupancyInfo"></ToiletOccupancy>
    </div>
    <div class="row row-3">
      <AirConditioner :airConditionerInfo="airConditionerInfo"
                      :maskmonitor="maskmonitor"
                      :airInfo="airInfo"
                      :onduty="onduty"
                      :blockeInfo="blockeInfo"
                      ref="energy"
                      @openDialog="openDialog"
                      @openAirDialog="openAirDialog"></AirConditioner>
      <RegionalCongestion :regionalInfo="regionalInfo"
                          ref="regional"
                          @resetToken="resetToken"
                          @openDialog="openDialog"></RegionalCongestion>
    </div>
    <Dialog :dialogVisible="dialogVisible"
            :detailsInfo="detailsInfo"
            @cancle="cancleDialog()"></Dialog>
    <ConditioningControlDialog :dialogVisible="airDialogVisible"
                               v-if="airDialogVisible"
                               @cancle="cancleAirDialog()"></ConditioningControlDialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, onUnmounted, ref } from 'vue'
import ScreenHeader from './components/screenHeader.vue'
import OutWeather from './components/outWeather.vue'
import OfficeAirQuality from './components/officeAirQuality.vue'
import SharedOffice from './components/sharedOffice.vue'
import MeetingRoom from './components/meetingRoom.vue'
import ToiletOccupancy from './components/toiletOccupancy.vue'
import AirConditioner from './components/airConditioner.vue'
import RegionalCongestion from './components/regionalCongestion.vue'
import Dialog from './components/dialog.vue'
import ConditioningControlDialog from './components/conditioningControlDialog.vue'
import moment from 'moment'
import { get, post } from '@/utils/axios'
import dataJson from '@/json/dataConfig.json'
import { useUserStore } from '@/store/moudules/appStore'
export default defineComponent({
  components: {
    ScreenHeader,
    OutWeather,
    OfficeAirQuality,
    SharedOffice,
    MeetingRoom,
    ToiletOccupancy,
    AirConditioner,
    RegionalCongestion,
    Dialog,
    ConditioningControlDialog,
  },
  setup() {
    const momentStr = ref('')
    const energy = ref()
    const regional = ref()
    const onMessageList: any = inject('onMessageList') // 接收注入
    const weatherInfo = ref<any>([]) // 室外天气数组
    const airInfo = ref<any>(null) // 空调信息

    const airQualityInfo = ref<any>({}) // 办公区空气质量
    const officeInfo = ref<any>([]) // 共享办公工位
    const meetingInfo = ref<any>([]) // 会议室
    const occupancyInfo = ref<any>({}) // 厕位占用情况
    const airConditionerInfo = ref<any>() // 暖通空调
    const regionalInfo = ref<any>() // 区域拥挤成都
    const maskmonitor = ref<any>(null) // 口罩告警信息
    const onduty = ref<any>(null) // 前台告警信息
    const detailsInfo = ref<any>(null) // 告警信息详情
    const blockeInfo = ref<any>(null) // 占道信息
    const scale = ref(0)
    const dialogVisible = ref(false)
    const airDialogVisible = ref(false)
    const userStore = useUserStore()
    const loginInfo = {
      username: 'jinma@qq.com',
      password: '123456',
    }
    let socket: WebSocket
    let socket2: WebSocket
    const loadingStatue = ref(true)
    let timer: any = null
    initData()
    onMounted(() => {
      //initData()
      setScale()
      window.addEventListener('resize', setScale)
      //监听窗口刷新、关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = function () {
        socket.close()
      }
    })
    function resetToken() {
      if (socket) {
        socket.close()
      }
      post('/auth/login', loginInfo).then((res: any) => {
        userStore.setToken(res.token)
        localStorage.setItem('token', res.token)
        const socketUrl =
          'ws://ib.thundercomm.com/api/ws/plugins/telemetry?token=' +
          userStore.getToken
        // const socketUrl =
        //   'ws://10.4.13.44:8080/api/ws/plugins/telemetry?token=' +
        //   userStore.getToken
        // let socketUrl =
        //   'ws://10.0.79.130:8888/api/ws/plugins/telemetry?token=' +
        //   userStore.getToken
        socket = new WebSocket(socketUrl)
        //连接发生错误刷新token重新链接
        // socket.onerror = function (event) {
        //   console.log('WebSocket:发生错误', event)
        //   socket.close()
        // }
        socket.onclose = function (event) {
          setTimeout(() => {
            resetToken()
          }, 5000)
        }
      })
    }
    const createSocket = () => {
      try {
        setTimeout(() => {
          // const socketUrl =
          //   'ws://10.4.13.44:8080/api/ws/plugins/telemetry?token=' +
          //   userStore.getToken
          const socketUrl =
            'ws://ib.thundercomm.com/api/ws/plugins/telemetry?token=' +
            userStore.getToken
          // let socketUrl =
          //   'ws://10.0.79.130:8888/api/ws/plugins/telemetry?token=' +
          //   userStore.getToken
          socket = new WebSocket(socketUrl)
          //连接发生错误刷新token重新链接
          // socket.onerror = function (event) {
          //   console.log('WebSocket:发生错误', event)
          //   socket.close()
          // }
          socket.onclose = function (event) {
            console.log('WebSocket:发生关闭', event)
            setTimeout(() => {
              resetToken()
            }, 5000)
          }
          socket.onopen = function (event) {
            sendWSRequest()
          }
        }, 1000)
      } catch (e) {
        console.log('catch' + e)
      }
    }
    function initData() {
      // 获取tokan
      post('/auth/login', loginInfo).then((res: any) => {
        userStore.setToken(res.token)
        // sessionStorage.setItem('lang', 'zh')
        localStorage.setItem('token', res.token)
        createSocket()
        loadingStatue.value = false
        momentStr.value = moment().format('YYYYMMDD')
        // 初始化会议室数据
        get('/aiot/screen/meetingRoom/rooms/getInitRoom').then((res: any) => {
          meetingInfo.value = res.data
          loadingStatue.value = false
        })
        // 分时段人数
        regional.value.getZhiDaNum()
        // 告警信息
        getAlarm()
        // 天气轮询、告警查询
        timer = window.setInterval(function () {
          regional.value.getZhiDaNum()
          wsRequestWeather()
          // getAlarm()
        }, 15000)
      })
    }
    function onMessage() {
      socket.onmessage = function (res: any) {
        const data = JSON.parse(res.data)
        // console.log(JSON.stringify(data.body))
        if (data.subscriptionId && data.subscriptionId) {
          airConditionerInfo.value = JSON.parse(data.data.reportInfo[0][1])
          return
        }
        if (JSON.stringify(data.body) !== '{}') {
          switch (data.type) {
            // 会议室信息
            case 'MEETING_ROOM_RESPONSE':
              delete data.body.timestamp
              if (
                JSON.stringify(meetingInfo.value) != JSON.stringify(data.body)
              ) {
                meetingInfo.value = data.body
              }
              break
            // 空气质量
            case 'OFFICE_ZONE_AIR_RESPONSE':
              airQualityInfo.value = data.body
              break
            // 近15日能源使用趋势图、智能断路器
            case 'breakers':
              if (
                JSON.stringify(airConditionerInfo.value) !=
                JSON.stringify(data.body.msg)
              ) {
                airConditionerInfo.value = JSON.parse(data.body.msg)
              }
              break
            // 共享办公位
            case 'SHARED_STATION_RESPONSE':
              delete data.body.timestamp
              if (
                JSON.stringify(officeInfo.value) != JSON.stringify(data.body)
              ) {
                officeInfo.value = data.body
              }
              break
            // 厕位占用
            case 'TOILET_SEAT_RESPONSE':
              if (
                JSON.stringify(occupancyInfo.value) != JSON.stringify(data.body)
              ) {
                occupancyInfo.value = data.body
              }
              break
            // 室外天气
            case 'WEATHER_RESPONSE':
              weatherInfo.value = data.body.weatherDataList
              break
            // 空调数据
            case 'AIR_CONDITIONING_RESPONSE':
              delete data.body.timestamp
              if (JSON.stringify(airInfo.value) != JSON.stringify(data.body)) {
                airInfo.value = data.body
              }
              break
          }
        }
      }
    }
    function sendWSRequest() {
      let typeList = [
        'MEETING_ROOM_REQUEST',
        'OFFICE_ZONE_AIR_REQUEST',
        'SENSOR_REQUEST',
        'SHARED_STATION_REQUEST',
        'TOILET_SEAT_REQUEST',
        'WEATHER_REQUEST',
        'AIR_CONDITIONING_REQUEST',
      ]
      typeList.forEach((item) => {
        let params
        if (item === 'WEATHER_REQUEST') {
          params = {
            type: item,
            body: { cityName: dataJson.cityName },
            wsType: 'jinma',
          }
        } else {
          params = {
            type: item,
            body: { nowDate: momentStr.value },
            wsType: 'jinma',
          }
        }
        if (socket.readyState === 1) {
          socket.send(JSON.stringify(params))
        }
      })
      var breakers = {
        tsSubCmds: [
          {
            entityType: 'DEVICE',
            entityId: '71a86d80-c503-11ec-884d-9f9fd290dbfc',
            scope: 'LATEST_TELEMETRY',
            cmdId: 123,
          },
        ],
      }
      socket.send(JSON.stringify(breakers))
      onMessage()
    }
    function wsRequestWeather() {
      // 室外天气
      let params = {
        type: 'WEATHER_REQUEST',
        body: { cityName: dataJson.cityName },
        wsType: 'jinma',
      }
      socket.send(JSON.stringify(params))
      onMessage()
    }
    function getAlarm() {
      let nowDate = new Date().getTime()
      let params = {
        //startTime: nowDate - 15 * 1000,
        startTime: 1648175933529,
        endTime: nowDate,
        // device: 'eb5-A',
        type: '',
        pageSize: 10,
        page: 0,
      }
      let typeList = [
        'maskinspectoradv',
        'ondutymonitoring',
        'blockedmonitoring',
        'peopledensitydetection',
      ]
      typeList.forEach((item: any) => {
        params.type = item
        let url: any
        switch (item) {
          case 'maskinspectoradv':
          case 'ondutymonitoring':
            url = '/aiot/alarmlist'
            break
          case 'blockedmonitoring':
          case 'peopledensitydetection':
            url = '/aiot/alarmlista'
            break
        }
        return new Promise(async (resolve) => {
          await get(url, params).then((res: any) => {
            switch (item) {
              case 'maskinspectoradv':
                maskmonitor.value = res.data
                break
              case 'ondutymonitoring':
                onduty.value = res.data
                break
              case 'blockedmonitoring':
                blockeInfo.value = res.data
                break
              case 'peopledensitydetection':
                regionalInfo.value = res.data
                break
            }
          })
        })
      })
      socket2 = new WebSocket('ws://47.108.21.244:48888/ws/alarm/3f55e990-333d-11ed-962e-91d2c6fb5f59');
            // 建立 websocket 连接成功触发事件
            socket2.onopen = function () {
                console.log("websoket服务器连接成功...2");
                    onMessage2()
            };
            socket2.onclose = function (evt) {
                console.log("websoket关闭...");
                // setTimeout(() => {
                //     createSocket(token, webSocket)
                // }, 4000)
            }
    }
    function onMessage2() {
      socket2.onmessage = function (res: any) {
        let data = JSON.parse(res.data) 
        debugger
        switch (data.data.algName) {
          case 'maskinspectoradv':
            maskmonitor.value = data
            break
          case 'ondutymonitoring':
            onduty.value = data
            break
          case 'blockingmonitoring':
            blockeInfo.value = data
            break
          case 'peopledensitydetection':
            regionalInfo.value = data
            break
        }
      }
    }
    function getScale() {
      const width = 1920,
        height = 1080
      let ww = window.innerWidth / width
      let wh = window.innerHeight / height
      return ww < wh ? wh : ww
    }
    function setScale() {
      scale.value = getScale()
      // console.log(scale.value)
      let dom = document.getElementById('app')
      dom!.style.transform = `scale(${scale.value})`
    }
    function openDialog(data: any) {
      dialogVisible.value = true
      detailsInfo.value = data
    }
    function openAirDialog() {
      airDialogVisible.value = true
    }
    function cancleDialog() {
      dialogVisible.value = false
    }
    function cancleAirDialog() {
      airDialogVisible.value = false
    }
    onUnmounted(() => {
      window.clearInterval(timer)
      timer = null
      window.removeEventListener('resize', setScale)
      if (socket) {
        socket.close()
      }
    })
    return {
      getScale,
      setScale,
      dialogVisible,
      airDialogVisible,
      openDialog,
      cancleDialog,
      cancleAirDialog,
      onMessageList,
      weatherInfo, // 室外天气数组
      airInfo,
      airQualityInfo, // 办公区空气质量
      officeInfo,
      meetingInfo,
      occupancyInfo,
      airConditionerInfo,
      regionalInfo,
      blockeInfo,
      wsRequestWeather,
      momentStr,
      onMessage,
      onMessage2,
      maskmonitor,
      onduty,
      detailsInfo,
      sendWSRequest,
      loadingStatue,
      energy,
      regional,
      initData,
      resetToken,
      openAirDialog,
    }
  },
})
</script>
<style lang="less" scoped>
.screenContainer {
  background-color: #091123;
  transform-origin: 0 0;
  position: absolute;
  width: 1920px;
  height: 1080px;
  user-select: none;
  .screen-header {
    margin: 24.5px 29px 0 29px;
  }
  .row {
    display: flex;
  }
  .row-1 {
    margin: 19px 30px 15px 30px;
    .container-border {
      height: 208px;
    }
  }
  .row-2 {
    margin: 0 30px 15px 30px;
    .container-border {
      height: 322px;
    }
  }
  .row-3 {
    margin: 0 30px 19px 30px;
    .container-border {
      height: 415px;
    }
  }
}
</style>
