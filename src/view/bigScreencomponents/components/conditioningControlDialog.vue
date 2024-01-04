<template>
  <div class="dialog_1">
    <el-dialog v-model="$attrs.dialogVisible"
               :title="$t('other.airConditioningControl')"
               destroy-on-close
               :draggable="true"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               width="890px"
               :before-close="handleClose">
      <div class='condition-body'>
        <div class="air-list">
          <el-scrollbar height="455px">
            <ul class="ul-list">
              <li v-for="(item, index) in airList"
                  :key="index"
                  :class="{active: index === activeIndex}"
                  @click="changeID(index)">{{item.deviceName}}</li>
            </ul>
          </el-scrollbar>
        </div>
        <div class="air-info">
          <div class="info-header">{{airList[activeIndex].deviceName}}</div>
          <div class="info-message">
            <div class="info-left">
              <div v-if="activeInfo.status === '1'"
                   class="info-contain">
                <div class="info-left-temp">
                  <span class="info-num">{{activeInfo.roomTemperature}} </span> <span class="info-unit">℃</span>
                </div>
                <div class="info-mark">
                  <img :src="fengliangImg"
                       alt="">
                  <div>风量：</div>
                  <div class="air-num">{{getVolume(activeInfo.airVolumeStatus)}}</div>|
                  <img class="air-mode"
                       :src="airModeImg"
                       alt="">
                  <div>模式：</div>
                  <div>{{getType(activeInfo.airModelStatus)}}</div>
                </div>
              </div>
              <div :class="{offImg: activeInfo.status !== '1'}"
                   class="air-image">
                <img :class="{air_off_img: activeInfo.status !== '1'}"
                     :src="activeInfo.status === '1' ? airConditionerOnImg : airConditionerOffImg"
                     alt="">
                <img class="air-switch"
                     :src="activeInfo.status === '1' ? switchOffImg :  switchOnImg"
                     @click="airChange(activeInfo.status === '1' ? 'off' : 'on')"
                     alt="">
              </div>
            </div>
            <div class="info-right">
              <div class="temp-title">{{ $t('officeType.temp') }}</div>
              <div :class="{'switch-off': activeInfo.status !== '1'}"
                   class="temp-opt">
                <button @click="airChange('down')"
                        class="temp-btn">{{ $t('officeType.temp') }} -</button>
                <div v-if="activeInfo.status !== '0'"
                     class="current-temp">{{activeInfo.roomTemperature}}</div>
                <div v-else
                     class="current-temp switch-off">--</div>
                <button @click="airChange('up')"
                        class="temp-btn">{{$t('officeType.temp')}} +</button>
              </div>
              <div class="temp-title">{{ $t('other.airVolume') }}</div>
              <div :class="{'switch-off': activeInfo.status !== '1'}"
                   class="temp-opt">
                <button class="temp-btn f-btn"
                        :class="{active: activeInfo.airVolumeStatus === item.id && activeInfo.status !== '0'}"
                        v-for="(item) in fengliang"
                        :disabled="activeInfo.status !== '1'"
                        @click="btnChange(item, 'feng')"
                        :key="item">{{item.name}}</button>
              </div>
              <div class="temp-title">{{ $t('other.airMode') }}</div>
              <div :class="{'switch-off': activeInfo.status !== '1'}"
                   class="temp-opt">
                <button class="temp-btn f-btn"
                        @click="btnChange(item, 'type')"
                        :class="{active: activeInfo.airModelStatus === item.id && activeInfo.status !== '0'}"
                        v-for="(item) in modeList"
                        :disabled="activeInfo.status !== '1'"
                        :key="item">{{item.name}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { useUserStore } from '@/store/moudules/appStore'
import { get, post } from '@/utils/axios'
import { defineComponent, onMounted, ref, reactive, watch } from 'vue'
import fengliangImg from '@/assets/jinma/fengliang.png'
import airModeImg from '@/assets/jinma/air_mode.png'
import airConditionerOnImg from '@/assets/jinma/air_conditioner_on.png'
import airConditionerOffImg from '@/assets/jinma/air_conditioner_off.png'
import switchOffImg from '@/assets/jinma/switch_off.png'
import switchOnImg from '@/assets/jinma/switch_on.png'
import { ElMessage } from 'element-plus'
import {useI18n} from "vue-i18n";
export default defineComponent({
  components: {},
  emit: ['cancle'],
  setup(props, context: any) {
    const { t } = useI18n();
    const airList = ref<any>([
      {
        deviceId: '',
        deviceName: '',
      },
    ])
    const userStore = useUserStore()
    const activeInfo = reactive({
      airModelStatus: '',
      airVolumeStatus: '',
      deviceId: '',
      roomTemperature: 0,
      status: '',
      temperatureStatus: '',
    })
    const fengliang = ref([
      { name: '自动', id: '0' },
      { name: '一级', id: '51' },
      { name: '二级', id: '102' },
      { name: '三级', id: '153' },
      { name: '四级', id: '204' },
      { name: '五级', id: '255' },
    ])
    const modeList = ref([
      { name: '自动', id: '0' },
      { name: '制热', id: '1' },
      { name: '制冷', id: '3' },
      { name: '通风', id: '9' },
      { name: '除湿', id: '10' },
    ])
    const activeIndex = ref(0)
    let timer: any = null
    let socket: WebSocket

    function cancle() {
      context.emit('cancle')
    }
    // 控制开关空调和温度控制
    function airChange(type: any) {
      let data = {}
      switch (type) {
        case 'up':
          if (
            activeInfo.roomTemperature > 16 &&
            activeInfo.roomTemperature < 35
          ) {
            activeInfo.roomTemperature += 1
          }
          data = {
            method: 'setTemperatureStatus',
            params: {
              deviceType: 'airConditioning',
              args: [activeInfo.roomTemperature], //开关 0.关  1.开
            },
          }
          break
        case 'down':
          if (
            activeInfo.roomTemperature > 16 &&
            activeInfo.roomTemperature < 35
          ) {
            activeInfo.roomTemperature -= 1
          }
          data = {
            method: 'setTemperatureStatus',
            params: {
              deviceType: 'airConditioning',
              args: [activeInfo.roomTemperature], //开关 0.关  1.开
            },
          }
          break
        case 'on':
          data = {
            method: 'setStatus',
            params: {
              deviceType: 'airConditioning',
              args: ['1'], //开关 0.关  1.开
            },
          }
          break
        case 'off':
          data = {
            method: 'setStatus',
            params: {
              deviceType: 'airConditioning',
              args: ['0'], //开关 0.关  1.开
            },
          }
          break
      }
      apiSend(data)
    }
    // 控制风量和空调模式
    function btnChange(item: any, type: any) {
      let data = {}
      if (type === 'feng') {
        activeInfo.airVolumeStatus = item.id
        data = {
          method: 'setAirVolumeStatus',
          params: {
            deviceType: 'airConditioning',
            args: [item.id], //开关 0.关  1.开
          },
        }
      } else if (type === 'type') {
        data = {
          method: 'setAirModelStatus',
          params: {
            deviceType: 'airConditioning',
            args: [item.id], //开关 0.关  1.开
          },
        }
        activeInfo.airModelStatus = item.id
      }
      apiSend(data)
    }
    function apiSend(data: any) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        post('/plugins/rpc/twoway/' + activeInfo.deviceId, data).then(
          (res: any) => {
            if (!JSON.parse(res).response.isSuccess) {
              ElMessage.error('配置失败.')
            }
            sendWSRequest(activeIndex.value)
          }
        )
      }, 1000)
    }

    // 空调风量
    function getVolume(val: any) {
      switch (val) {
        case '0':
          return '自动'
        case '51':
          return '一级'
        case '102':
          return '二级'
        case '153':
          return '三级'
        case '204':
          return '四级'
        case '255':
          return '五级'
      }
    }
    // 空调模式
    function getType(val: any) {
      switch (val) {
        case '0':
          return '自动'
        case '1':
          return '制热'
        case '3':
          return '制冷'
        case '9':
          return '通风'
        case '10':
          return '除湿'
      }
    }
    function handleClose() {
      context.emit('cancle')
    }
    // 切换左侧空调展示
    function changeID(index: any) {
      activeIndex.value = index
      // 重复点击一个空调 不调用接口
      if (activeInfo.deviceId !== airList.value[index].deviceId) {
        sendWSRequest(index)
      }
    }
    // 获取空调列表
    function getDataList() {
      get('/air/getAirList?deviceType=airConditioning').then((res: any) => {
        airList.value = res
        getDetail(0)
      })
    }

    // 获取空调详情
    function getDetail(index: any) {
      const socketUrl =
        'ws://ib.thundercomm.com/api/ws/plugins/telemetry?token=' +
        userStore.getToken
      socket = new WebSocket(socketUrl)
      socket.onopen = function (event) {
        sendWSRequest(index)
      }
    }
    function sendWSRequest(index: any) {
      let params = {
        tsSubCmds: [
          {
            entityType: 'DEVICE', //固定写法
            entityId: airList.value[index].deviceId, //设备id
            scope: 'LATEST_TELEMETRY', //固定写法
            cmdId: activeIndex.value, //当前websocket唯一标识
          },
        ],
      }
      socket.send(JSON.stringify(params))
      onMessage(index)
    }
    function onMessage(index: any) {
      socket.onmessage = function (res: any) {
        const data = JSON.parse(res.data)
        // console.log(JSON.stringify(data.body))
        if (
          data.subscriptionId !== undefined &&
          data.subscriptionId === activeIndex.value
        ) {
          console.log(data.data.airModelStatus)
          activeInfo.airModelStatus = data.data.airModelStatus[0][1]
          activeInfo.airVolumeStatus = data.data.airVolumeStatus[0][1]
          activeInfo.status = data.data.status[0][1]
          activeInfo.deviceId = airList.value[index].deviceId
          activeInfo.roomTemperature = parseInt(
            data.data.temperatureStatus[0][1]
          )
        }
      }
    }
    onMounted(() => {
      getDataList()
    })
    return {
      cancle,
      handleClose,
      airList,
      activeIndex,
      changeID,
      getVolume,
      getType,
      fengliang,
      modeList,
      airChange,
      getDataList,
      btnChange,
      apiSend,
      activeInfo,
      sendWSRequest,
      onMessage,
      fengliangImg,
      airModeImg,
      airConditionerOnImg,
      airConditionerOffImg,
      switchOffImg,
      switchOnImg,
      t
    }
  },
})
</script>
<style lang="less">
.dialog_1 {
  .el-overlay {
    .el-overlay-dialog {
      .el-dialog {
        background: #091123;
        border: 1px solid #427891;
        height: 530px;
        .el-dialog__header {
          border-bottom: 1px solid rgba(122, 222, 255, 0.05);
          .el-dialog__title {
            font-size: 20px;
            font-weight: 500;
            color: #ffffff;
          }
        }
        .el-dialog__body {
          padding: 10px;
          height: 455px;
          .condition-body {
            height: 100%;
            display: flex;
            .air-list {
              width: 120px;
              height: 435px;
              overflow: hidden;
              .ul-list {
                list-style: none;
                padding-left: 5px;
                margin-top: 0px;
                border-right: 1px solid #203a4f;
                .active {
                  color: #36bbd2;
                }
                li {
                  line-height: 35px;
                  cursor: pointer;
                }
              }
            }
            .air-info {
              width: 725px;
              height: 435px;
              background: #0a182d;
              border: 1px solid #0e1f37;
              border-radius: 8px;
              margin: 0 auto;
              .info-header {
                font-size: 18px;
                font-weight: 500;
                color: #ffffff;
                height: 50px;
                line-height: 50px;
                padding-left: 20px;
                border-bottom: 1px solid;
                border-image: -webkit-linear-gradient(
                    -270deg,
                    rgba(255, 255, 255, 0) 0%,
                    #254572 20%,
                    rgba(255, 255, 255, 0) 99%
                  )
                  2 2 2 2;
                border-image: -moz-linear-gradient(
                    -270deg,
                    rgba(255, 255, 255, 0) 0%,
                    #254572 20%,
                    rgba(255, 255, 255, 0) 99%
                  )
                  2 2 2 2;
                border-image: linear-gradient(
                    -270deg,
                    rgba(255, 255, 255, 0) 3%,
                    #254572 42%,
                    rgba(255, 255, 255, 0) 105%
                  )
                  2 2 2 2;
              }
              .info-message {
                display: flex;
                .info-left {
                  width: 300px;
                  height: 378px;
                  border-right: 1px solid;
                  border-image: -webkit-linear-gradient(
                      0deg,
                      rgba(255, 255, 255, 0) 0%,
                      #254572 20%,
                      rgba(255, 255, 255, 0) 99%
                    )
                    2 2 2 2;
                  border-image: -moz-linear-gradient(
                      0deg,
                      rgba(255, 255, 255, 0) 0%,
                      #254572 20%,
                      rgba(255, 255, 255, 0) 99%
                    )
                    2 2 2 2;
                  border-image: linear-gradient(
                      0deg,
                      rgba(255, 255, 255, 0) 3%,
                      #254572 42%,
                      rgba(255, 255, 255, 0) 105%
                    )
                    2 2 2 2;
                  .offImg {
                    margin-top: 132px;
                  }
                  .info-contain {
                    .info-left-temp {
                      margin-top: 50px;
                      color: #ffffff;
                      text-align: center;
                      .info-num {
                        font-size: 38px;
                        font-weight: 400;
                      }
                      .info-unit {
                        font-size: 20px;
                      }
                    }
                    .info-mark {
                      display: flex;
                      justify-content: center;
                      color: #bbd3e5;
                      margin-bottom: 20px;
                      img {
                        margin-right: 7px;
                        width: 17px;
                        height: 17px;
                      }
                      .air-num {
                        margin-right: 10px;
                      }
                      .air-mode {
                        margin-left: 5px;
                      }
                    }
                  }
                  .air-image {
                    img {
                      margin: 0 auto;
                      margin-top: 10px;
                      display: block;
                    }
                    .air_off_img {
                      margin-bottom: 31px;
                    }
                    .air-switch {
                      cursor: pointer;
                    }
                  }
                }
                .info-right {
                  padding: 15px 0 0 10px;
                  height: 378px;
                  width: 428px;
                  color: #ffffff;
                  .temp-title {
                    font-size: 16px;
                  }
                  .switch-off {
                    button {
                      color: rgba(187, 211, 229, 0.25) !important;
                    }
                  }
                  .temp-opt {
                    display: flex;
                    margin-top: 10px;
                    flex-wrap: wrap;
                    margin-bottom: 10px;
                    .temp-btn {
                      width: 90px;
                      height: 40px;
                      background: #0e1f37;
                      border-radius: 5px;
                      border: 0px;
                      color: #bbd3e5;
                      cursor: pointer;
                    }
                    .f-btn {
                      margin-right: 12px;
                      margin-bottom: 10px;
                    }
                    .active {
                      background: #36bbd2;
                      color: #fff;
                    }
                    .current-temp {
                      width: 90px;
                      height: 40px;
                      background: #0e1f37;
                      border: 1px solid #36bbd2;
                      border-radius: 5px;
                      text-align: center;
                      font-size: 17px;
                      font-weight: bold;
                      line-height: 40px;
                      margin-right: 12px;
                      margin-left: 12px;
                    }
                    .switch-off {
                      color: rgba(187, 211, 229, 0.25);
                      border: 1px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
