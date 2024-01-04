<template>
  <div class="container-border">
    <div class="line-1">
      <div class="conditioner">
        <TitleHeader id="001" class="air"
                     :text="'title.airConditioner'"></TitleHeader>
        <DoublePieCharts :height="150"
                         :width="120"
                         :info="info"
                         @click="openAirDialog()"
                         :id="'air_conditioner'"></DoublePieCharts>
        <div class="charts-exp">
          <div class="num_1_color"></div>
          <div class="name">{{ $t("other.fanCoil") }}</div>
          <div>{{ info.current[0] }}/{{ info.max[0] }}</div>
          <div class="num_2_color"></div>
          <div class="name">VRV</div>
          <div>{{ info.current[1] }}/{{ info.max[1] }}</div>
        </div>
      </div>
      <div class="trend-chart">
        <TitleHeader :text="'title.energyMap'"></TitleHeader>
        <BandLineCharts :height="165"
                        :width="570"
                        :energyInfo="energyInfo"
                        :id="'band_lineCharts'"></BandLineCharts>
      </div>
    </div>
    <div class="line-2">
      <div class="smoke_div">
        <TitleHeader :text="'title.smokeSensor'"></TitleHeader>
        <img src="@/assets/jinma/icon_smoke.png"
             alt="">
        <div class="alert_item">
          <span>{{ $t("other.online") }} {{ sensorInfo.smokeSensorData.onlineNum || 3 }}</span> <span>{{ $t("other.alert") }} {{ sensorInfo.smokeSensorData.alarmNum || 0}}</span>
        </div>
      </div>
      <div class="ai_break">
        <TitleHeader  class="ai_break_title"
                     :text="'title.intelligentCircuitBreaker'"></TitleHeader>
        <img src="@/assets/jinma/icon_ai_barke.png"
             alt="">
        <div class="alert_item">
          <span>{{ $t("other.online") }} {{ sensorInfo.cutoutSwitchData.onlineNum || 0}}</span> <span>{{ $t("other.alert") }} {{ sensorInfo.cutoutSwitchData.alarmNum || 0}}</span>
        </div>
      </div>
      <div class="stage_div">
        <TitleHeader class="stage_div_title"
                     :text="'title.reception'"></TitleHeader>
        <div class="stage_list">
          <div @click="openDialog($attrs.onduty)"
               class="item">
            <div :class="qiantaiStatus.dutyStatus ? 'qiantaiStatus_blue' : `qiantaiStatus_red${suffix1}`"
                 class="img_div"></div>
            <div class="info">{{ qiantaiStatus.dutyStatus ? $t("other.someoneOnDuty") : $t("other.nooneOnDuty") }}</div>
          </div>
          <div @click="openDialog($attrs.maskmonitor)"
               class="item">
            <div :class="kouzhaoStatus ? `kouzhaoStatus_red${suffix2}` : 'kouzhaoStatus_blue'"
                 class="img_div"></div>
            <div class="info">{{ kouzhaoStatus ? $t("other.someoneNotMask") : $t("other.nooneNotMask") }}</div>
          </div>
        </div>
      </div>
      <div class="monitor_div">
        <TitleHeader class="monitor_div_title"
                     :text="'title.roadOccupationMonitoring'"></TitleHeader>
        <div class="monitor_list">
          <div @click="openDialog($attrs.blockeInfo, item.roadId)"
               v-for="item, index in monitorList"
               :key="index"
               :class="item.occupiedStatus ? 'blue' : 'red'"
               class="monitor_item">
            <span v-if="lang == 'zh'">{{ item.roadId }}号</span><span v-if="lang == 'en'">NO.{{ item.roadId }}</span><span v-if="lang == 'en'">&nbsp;</span>{{(item.occupiedStatus ? $t('other.no') : $t('other.find'))}}<span v-if="lang == 'en'">&nbsp;</span>{{ $t('other.jeeves')}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue'
import DoublePieCharts from '@/components/doublePieCharts.vue'
import TitleHeader from './titleHeader.vue'
import BandLineCharts from '@/components/bandLineCharts.vue'
import StageImgBlue from '@/assets/jinma/icon_qiantai_blue.png'
import MaskImgRed from '@/assets/jinma/icon_kouzhao_red.png'
import StageImgRed from '@/assets/jinma/icon_qiantai_red.png'
import MaskImgBlue from '@/assets/jinma/icon_kouzhao_blue.png'
import moment from 'moment'
import {useI18n} from "vue-i18n";
export default defineComponent({
  components: {
    DoublePieCharts,
    TitleHeader,
    BandLineCharts,
  },
  emits: ['openDialog', 'openAirDialog'],
  setup(props, context) {
    const suffix1 = ref('')
    const suffix2 = ref('')
    const { t, locale } = useI18n();
    const lang = ref('')
    const info = reactive({
      max: [0, 0],
      color: ['#0F6ECE', '#14C6CA'],
      current: [0, 0],
      subtext: t('other.total'),
    })
    function title() {
      return  t('title.airConditioner')

    }
    watch(
          () => locale.value,
          () => {
            lang.value = locale.value
            info.subtext = t('other.total')
          }
    )
    const sensorInfo = reactive({
      smokeSensorData: {
        onlineNum: 0,
        alarmNum: 0,
      },
      cutoutSwitchData: {
        onlineNum: 0,
        alarmNum: 0,
      },
    })
    const energyInfo = reactive<any>({
      xList: [
        '',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
      ],
      yList: [0, 30, 60, 90, 120, 150],
      color: ['rgba(254, 172, 104, 0.5)', 'rgba(60, 207, 228, 0.1)'],
      bottomColor: ['rgba(27, 25, 38, 0.15)', 'rgba(27, 25, 38, 0.15)'],
      data1: [60, 80, 80, 100, 110, 115, 120, 120, 125, 135, 135, 135, 140, 140, 150],
    })
    const qiantaiStatus = reactive({
      dutyStatus: 0,
      alarmId: '',
    })
    const kouzhaoStatus = ref(0)
    const monitorList: any = reactive([
      {
        occupiedStatus: 1,
        roadId: 1,
      },
      {
        occupiedStatus: 1,
        roadId: 2,
      },
      {
        occupiedStatus: 1,
        roadId: 3,
      },
      {
        occupiedStatus: 1,
        roadId: 4,
      },
    ])
    let timer: any = null

    onMounted(() => {
      debugger
      lang.value = locale.value
      timer = window.setInterval(function () {
        var refreshHours: number = new Date().getHours()
        var refreshMin: number = new Date().getMinutes()
        var refreshSec: number = new Date().getSeconds()
        // 近15日能源使用趋势图每天凌晨请求一次数据
        if (refreshHours === 0 && refreshMin === 0 && refreshSec === 0) {
          // getEnergyData()
        }
        // 每5秒轮询
        if (refreshSec % 5 === 0) {
        }
      }, 1000)
    })
    onBeforeUnmount(() => {
      window.clearInterval(timer)
      timer = null
    })
    function openDialog(value: any, index?: any) {
      if (index) {
        let name = 'aes' + index
        context.emit('openDialog', value[name][0])
      } else {
        if (value.length > 0) {
          context.emit('openDialog', value[0])
        }
      }
    }
    function openAirDialog() {
      context.emit('openAirDialog')
    }
    watch(
      () => [context.attrs.airConditionerInfo, context.attrs.blockeInfo],
      () => {
        let data: any = context.attrs.airConditionerInfo
        if (data) {
          try {
            let reportInfo = data
            if (reportInfo.electricityDayDataList) {
              // energyInfo.data1 = reportInfo.electricityDayDataList.map(
              //   (item: any) => item.electricityNum + ''
              // )
              sensorInfo.cutoutSwitchData.onlineNum = reportInfo.onlineNum
              sensorInfo.cutoutSwitchData.alarmNum = reportInfo.warningNum
            }
          } catch (e) {
            return false
          }
        }
        let blockeInfo: any = context.attrs.blockeInfo
        if (blockeInfo && blockeInfo !== null) {
          // monitorList.forEach((item: any) => {
          //   if (Object.keys(blockeInfo).join().indexOf(item.roadId) !== -1) {
          //     item.occupiedStatus = 0
          //   } else {
          //     item.occupiedStatus = 1
          //   }
          // })
          if (blockeInfo.value.cameraId == 'RTSP-ff808181855163dc0185535f4e380005') {
            monitorList[0].occupiedStatus = 0
          setTimeout(() => {
            monitorList[0].occupiedStatus = 1
          }, 5000)
        } else if (blockeInfo.value.cameraId == 'RTSP-ff8081818556ce070185573c4cbd0000') {
            monitorList[1].occupiedStatus = 0
          setTimeout(() => {
            monitorList[1].occupiedStatus = 1
          }, 5000)
        } else if (blockeInfo.value.cameraId == 'RTSP-ff808181855163dc0185535fc9f70008') {
          monitorList[2].occupiedStatus = 0
          setTimeout(() => {
            monitorList[2].occupiedStatus = 1
          }, 5000)
         
        } else if (blockeInfo.value.cameraId == 'RTSP-ff808181855163dc0185535f9ed90007') {
          monitorList[3].occupiedStatus = 0
          setTimeout(() => {
            monitorList[3].occupiedStatus = 1
          }, 5000)
          }
        }
      }
    )
    watch([() => context.attrs.maskmonitor], () => {
      let maskData: any = context.attrs.maskmonitor
      // if (maskData.length > 0) {
      if (maskData) {
        kouzhaoStatus.value = 1
        suffix2.value = '_flash'
        setTimeout(() => {
          suffix2.value = ''
          kouzhaoStatus.value = 0
        }, 3000)
      } else {
        kouzhaoStatus.value = 0
      }
    })
    watch([() => context.attrs.airInfo], () => {
      let airInfo: any = context.attrs.airInfo
      info.current = [airInfo.fanActiveNum, airInfo.vrvActiveNum]
      info.max = [airInfo.fanAllNum, airInfo.vrvAllNum]
    })
    watch([() => context.attrs.onduty], () => {
      let dutyData: any = context.attrs.onduty
      // if (dutyData && dutyData.length > 0) {
      if (dutyData) {
        suffix1.value = '_flash'
        qiantaiStatus.dutyStatus = 0
        setTimeout(() => {
          suffix1.value = ''
          qiantaiStatus.dutyStatus = 1
        }, 3000)
      } else {
        qiantaiStatus.dutyStatus = 1
      }
    })
    return {
      info,
      energyInfo,
      StageImgBlue,
      MaskImgRed,
      StageImgRed,
      MaskImgBlue,
      qiantaiStatus,
      kouzhaoStatus,
      monitorList,
      openDialog,
      openAirDialog,
      sensorInfo,
      suffix1,
      suffix2,
      t,
      title,
      lang
    }
  },
})
</script>
<style lang="less" scoped>
.container-border {
  width: 842px;
  margin-right: 15px;
}
.line-1 {
  display: flex;
  .conditioner {
    border-right: 1px solid #091b33;
    width: 217px;
    height: 201px;
    margin: 18px 0;
    padding: 0 18px;
    .air {
      margin-bottom: 10px !important;
    }
    .charts-exp {
      display: flex;
      justify-content: center;
      color: #ffffff;
      line-height: 17px;
      font-size: 12px;
      white-space: nowrap;
      .num_1_color {
        width: 9px;
        height: 9px;
        background: #0f6ece;
        border-radius: 50%;
        margin: 4px;
      }
      .num_2_color {
        width: 9px;
        height: 9px;
        background: #14c6ca;
        border-radius: 50%;
        margin: 4px 4px 4px 8px;
      }
      .name {
        margin-right: 6px;
      }
    }
  }
  .trend-chart {
    width: 625px;
    margin: 18px 0;
    padding: 0 18px;
  }
}
.line-2 {
  display: flex;
  width: 804px;
  margin: 0 0 0 18px;
  padding-top: 18px;
  border-top: 1px solid #091b33;
  .smoke_div {
    width: 131px;
    border-right: 1px solid #091b33;
    text-align: center;
    color: #ffffff;
    margin-bottom: 10px;
    .alert_item {
      margin-top: 6px;
      font-size: 12px;
      color: #ccf1f7;
      span {
        margin-right: 5px;
      }
    }
  }
  .ai_break {
    width: 150px;
    border-right: 1px solid #091b33;
    text-align: center;
    color: #ffffff;
    margin-bottom: 10px;
    .ai_break_title {
      padding-left: 15px;
    }
    .alert_item {
      margin-top: 6px;
      font-size: 12px;
      color: #ccf1f7;
      span {
        margin-right: 5px;
      }
    }
  }
  .stage_div {
    width: 225px;
    border-right: 1px solid #091b33;
    margin-bottom: 10px;
    .stage_div_title {
      padding-left: 15px;
    }
    .stage_list {
      display: flex;
      justify-content: space-around;
      text-align: center;
    }
    .item {
      cursor: pointer;
      .img_div {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        margin: auto;
      }
      .qiantaiStatus_blue {
        background: url('@/assets/jinma/icon_qiantai_blue.png') center center
          no-repeat;
      }
      div[class^='qiantaiStatus_red'] {
        background: url('@/assets/jinma/icon_qiantai_red.png') center center
          no-repeat;
        // animation: img_div 0.7s;
        // animation-iteration-count: 3;
      }
      div[class^='kouzhaoStatus_red'] {
        background: url('@/assets/jinma/icon_kouzhao_red.png') center center
          no-repeat;
        // animation: img_div 0.7s;
        // animation-iteration-count: 3;
      }
      .qiantaiStatus_red_flash {
        animation: img_div 0.7s;
        animation-iteration-count: 3;
      }
      .kouzhaoStatus_red_flash {
        animation: img_div 0.7s;
        animation-iteration-count: 3;
      }
      .kouzhaoStatus_blue {
        background: url('@/assets/jinma/icon_kouzhao_blue.png') center center
          no-repeat;
      }

      .info {
        font-size: 12px;
        color: #ffffff;
        margin-top: 5px;
      }
    }
  }
  .monitor_div {
    .monitor_div_title {
      padding-left: 15px;
    }
    .monitor_list {
      display: flex;
      flex-wrap: wrap;
      width: 295px;
      .monitor_item {
        width: 116px;
        margin-left: 18px;
        font-size: 12px;
        line-height: 30px;
        text-align: center;
        height: 30px;
        margin-bottom: 20px;
      }
      .blue {
        border: 1px solid #4dbfff;
        color: #4dbfff;
      }
      .red {
        border: 1px solid #ef555a;
        cursor: pointer;
        color: #ef555a;
      }
    }
  }
}
@keyframes img_div {
  from {
    -webkit-box-shadow: 0px 0px 0px 0px rgba(253, 108, 108, 1);
    -moz-box-shadow: 0px 0px 0px 0px rgba(253, 108, 108, 1);
    box-shadow: 0px 0px 0px 0px rgba(253, 108, 108, 1);
  }
  to {
    -webkit-box-shadow: 0px 0px 14px 4px rgba(253, 108, 108, 1);
    -moz-box-shadow: 0px 0px 14px 4px rgba(253, 108, 108, 1);
    box-shadow: 0px 0px 14px 4px rgba(253, 108, 108, 1);
  }
}

</style>
