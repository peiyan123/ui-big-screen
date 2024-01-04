<template>
  <div id="report-body"
       class="report-body">
    <div class="report-contant">
      <ScreenHeader></ScreenHeader>
      <div>
        <div class="block">
          <span class="demonstration">{{ $t("other.selectTime") }}</span>
          <el-button-group>
            <el-button @click="changeType('week')"
                       :class="{primary: selectType === 'week'}">{{ $t("other.lastWeek") }}</el-button>
            <el-button @click="changeType('harf')"
                       :class="{primary: selectType === 'harf'}">
              {{ $t("other.lastHalfMonth") }}
            </el-button>
            <el-button @click="changeType('month')"
                       :class="{primary: selectType === 'month'}">
              {{ $t("other.lastMonth") }}
            </el-button>
          </el-button-group>

          <span style="color: #fff; float: right;margin-right: 60px;background-color: crimson;padding: 5px;border-radius: 5px;" @click="closeTab()"> X </span>
        </div>
        <div id="report_1"
             v-loading="loadingStatue"
             element-loading-background="rgba(0, 0, 0, 0.5)"
             class="myChart"></div>
        <div id="report_2"
             v-if="type === 'meet'"
             v-loading="loadingStatue"
             element-loading-background="rgba(0, 0, 0, 0.5)"
             class="myChart"></div>
      </div>
      <DrawerTable v-if="drawerFlag"
                   :drawerTitle="drawerTitle"
                   :drawerFlag="drawerFlag"
                   :selectData="selectData"
                   @close="close()"></DrawerTable>
    </div>
  </div>
</template>

<script lang="ts">
import * as echarts from 'echarts'
import {
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  render,
  toRaw,
  watch,
} from 'vue'
import ScreenHeader from './bigScreencomponents/components/screenHeader.vue'
import DrawerTable from './bigScreencomponents/components/drawerTable.vue'
import moment from 'moment'
import { post } from '@/utils/axios'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/moudules/appStore'
import {useI18n} from "vue-i18n";

export default defineComponent({
  components: {
    DrawerTable,
    ScreenHeader,
  },
  setup() {
    let params = window.location.hash.split('?')
    let token = params[1].substr(6).split('&type=')[0]
    const type = params[1].split('&type=')[1]
    localStorage.setItem('token', token)
    ;(window as any).openDrawer = function (val: any) {
      if (val === '0') {
        drawerTitle.value = t('other.meetRoomUseDetail')
        document!.getElementById('chartLabel1')!.style.display = 'none'
      } else {
        drawerTitle.value = t('other.meetRoomUseDetailReal')
        document!.getElementById('chartLabel2')!.style.display = 'none'
      }
      drawerFlag.value = true
    }
    const selectData = ref('')
    const drawerTitle = ref('')
    const dataStart = ref('')
    const loadingStatue = ref(false)
    const dataEnd = ref('')
    const selectType = ref('week')
    const drawerFlag = ref(false)
    const userStore = useUserStore()
    const lang = ref('zh')
    const { t, locale } = useI18n();
    watch(() => locale.value,
            () => {
              lang.value = locale.value
            }
    )
    onMounted(() => {
      userStore.setToken(token)
      lang.value = locale.value
      option1['lang'] = locale.value
      let myChart1 = echarts.init(document.getElementById('report_1') as any)
      // 绘制图表
      myChart1.setOption(type === 'meet' ? option1 : option3, true)
      if (type === 'meet') {
        let myChart2 = echarts.init(document.getElementById('report_2') as any)
        // 绘制图表
        myChart2.setOption(option2, true)
      }

      getDataLimit('week')
      getDurationData()
    })
    function closeTab() {
      window.close();
    }
    function getDurationData() {
      loadingStatue.value = true
      let params = {
        startTime: dataStart.value,
        endTime: dataEnd.value,
      }
      let url
      if (type === 'meet') {
        url = '/aiot/screen/meetingRoom/rooms/duration'
      } else {
        url = '/aiot/screen/getToiletCountData'
      }
      post(url, params).then((res: any) => {
        if (type === 'meet') {
          setEchartsData(res)
        } else {
          setToilet(res)
        }
        loadingStatue.value = false
      })
    }
    function setToilet(res: any) {
      option3.series[0].data = Object.values(res.northM)
      option3.series[1].data = Object.values(res.northF)
      option3.series[2].data = Object.values(res.southM)
      option3.series[3].data = Object.values(res.southF)
      let myChart1
      myChart1 = echarts.getInstanceByDom(
        document.getElementById('report_1') as HTMLElement
      ) as echarts.ECharts
      myChart1.setOption(option3, true)
    }
    function getDataLimit(type: any) {
      dataEnd.value = moment().format('YYYY-MM-DD')
      if (type === 'week') {
        dataStart.value = moment().subtract(7, 'day').format('YYYY-MM-DD')
        return
      } else if (type === 'harf') {
        dataStart.value = moment().subtract(15, 'day').format('YYYY-MM-DD')
        return
      } else {
        dataStart.value = moment().subtract(1, 'month').format('YYYY-MM-DD')
        return
      }
    }
    function changeType(type: any) {
      selectType.value = type
      getDataLimit(type)
    }
    function close() {
      drawerFlag.value = false
    }
    function setEchartsData(res: any) {
      debugger

      option1.xAxis.data = Object.keys(res.data.schedule['水调歌头'])
        .sort()
        .map((item: any) => {
          return moment(item).format('YYYY/MM/DD')
        })
      option2.xAxis.data = option1.xAxis.data
      let roomList = [
        '水调歌头',
        '清平乐',
        '风陵渡',
        '醉花阴',
        '菩萨蛮',
        '忆江南',
        '卜算子',
        '沁园春',
        '如梦令',
      ]
      roomList.forEach((item: any, index: any) => {
        option1.series[index].data = Object.keys(res.data.schedule[item])
          .sort()
          .map((val: any) => {
            return res.data.schedule[item][val]
          })
        console.log(Object.values(res.data.radar[item]))
        option2.series[index].data = Object.keys(res.data.radar[item])
          .sort()
          .map((val: any) => {
            return res.data.radar[item][val]
          })
      })
      setOption()
    }
    function setOption() {
      let myChart1
      let myChart2
      myChart1 = echarts.getInstanceByDom(
        document.getElementById('report_1') as HTMLElement
      ) as echarts.ECharts
      if (type === 'meet') {
        myChart2 = echarts.getInstanceByDom(
          document.getElementById('report_2') as HTMLElement
        ) as echarts.ECharts
      }
      option1.title.text =
        selectType.value === 'week'
          ? t('other.meettingReportWeek')
          : selectType.value === 'harf'
          ? t('other.meettingReportHarfMonth')
          : t('other.meettingReportMonth')
      option2.title.text =
        selectType.value === 'week'
          ? t('other.meettingRealWeek')
          : selectType.value === 'harf'
          ? t('other.meettingRealHarfMonth')
          : t('other.meettingRealMonth')
      option3.title.text = t('other.toiletOccupancyByTime'),
              option3.legend.data = [t('other.manNorth'), t('other.womanNorth'), t('other.manSouth'), t('other.womanSouth')]
      option3.series[0].name = t('other.manNorth')
      option3.series[1].name = t('other.womanNorth')
      option3.series[2].name = t('other.manSouth')
      option3.series[3].name = t('other.womanSouth')
      myChart1.setOption(type === 'meet' ? option1 : option3, true)
      myChart2?.setOption(option2, true)
    }
    watch(
      () => dataStart.value,
      async (cur, pre) => {
        if (pre !== '') {
          await getDurationData()
        }
      }
    )
    watch(
            () => locale.value,
             () => {
               setOption()
               option1['lang'] = locale.value
            }
    )
    const option1 = {
      lang: '',
      title: {
        text: t('other.meetingTitle1'),
        textStyle: {
          color: '#fff',
        },
      },
      color: [
        '#DA6D73',
        '#3CCFE4',
        '#d37ec8',
        '#689cd1',
        '#85d32f',
        '#ff0000',
        '#4aad38',
        '#387cad',
        '#4a18e1',
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '1%',
        top: '25%',
        containLabel: true,
      },
      tooltip: {
        // 鼠标是否可以进入悬浮框
        enterable: true,
        // 触发方式 mousemove, click, none, mousemove|click
        triggerOn: `click`,
        // item 图形触发， axis 坐标轴触发， none 不触发
        trigger: `axis`,
        // 浮层隐藏的延迟
        hideDelay: 800,
        // 背景色
        backgroundColor: `rgba(64,106,163,0.65)`,
        formatter: function (params: any) {
          selectData.value = moment(params[0].axisValue).format('YYYY-MM-DD')
          return `<div id="chartLabel1" class="chartLabel">
                  <div class="data">${moment(params[0].axisValue).format(
                    'MM月DD日'
                  )}：</div>
          ${params
            .map((item: any) => {
              debugger
              return `
                  <div class="charts-item">
                    <span class="title">${item.seriesName}</span>
                    <span class="label">${item.data}</span>
                  </div>`
            })
            .join(' ')}
              <button id="btn-tooltip" onClick="openDrawer('0')"> ${lang.value == 'zh' ? '查看使用详情' : 'View usage details'} </button>
            </div>`
        },
      },
      legend: {
        top: '15%',
        textStyle: {
          color: '#fff',
        },
        data: [
          '666',
          '510',
          '507',
          '508',
          '509',
          '501',
          '506',
          '503',
          '502',
        ],
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick: {
          show: false,
        },
        data: ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
      },
      yAxis: {
        type: 'value',
        postition: 'left',
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: '{value} min',
        },
        //data: info.yList
      },
      series: [
        {
          name: '666',
          type: 'line',
          silent: true,
          stack: 'Total1',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,

          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(254, 172, 104, 0.5)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '510',
          type: 'line',
          silent: true,
          stack: 'Total2',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(60, 207, 228, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '507',
          type: 'line',
          silent: true,
          stack: 'Total3',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(60, 207, 228, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '508',
          type: 'line',
          silent: true,
          stack: 'Total4',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(60, 25, 228, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '509',
          type: 'line',
          silent: true,
          stack: 'Total5',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(60, 207, 55, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '501',
          type: 'line',
          silent: true,
          stack: 'Total6',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(60, 207, 12, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '506',
          type: 'line',
          silent: true,
          stack: 'Total7',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(158, 150, 150, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '503',
          type: 'line',
          silent: true,
          stack: 'Total8',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(12, 222, 228, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '502',
          type: 'line',
          silent: true,
          stack: 'Total9',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(60, 11, 151, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
    }
    const option2 = {
      title: {
        text: t('other.meetingTitle2'),
        textStyle: {
          color: '#fff',
        },
      },
      color: [
        '#DA6D73',
        '#3CCFE4',
        '#d37ec8',
        '#689cd1',
        '#85d32f',
        '#ff0000',
        '#4aad38',
        '#387cad',
        '#4a18e1',
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '1%',
        top: '25%',
        containLabel: true,
      },
      tooltip: {
        // 鼠标是否可以进入悬浮框
        enterable: true,
        // 触发方式 mousemove, click, none, mousemove|click
        triggerOn: `click`,
        // item 图形触发， axis 坐标轴触发， none 不触发
        trigger: `axis`,
        // 浮层隐藏的延迟
        hideDelay: 800,
        // 背景色
        backgroundColor: `rgba(64,106,163,0.65)`,
        formatter: function (params: any) {
          selectData.value = moment(params[0].axisValue).format('YYYY-MM-DD')
          return `<div id="chartLabel2" class="chartLabel">
                  <div class="data">${moment(params[0].axisValue).format(
                    'MM月DD日'
                  )}：</div>
          ${params
            .map((item: any) => {
              return `<div class="charts-item">
                    <span class="title">${item.seriesName}</span>
                    <span class="label">${item.data}</span>
                    </div>`
            })
            .join(' ')}
              <button id="btn-tooltip" onClick="openDrawer('0')"> ${lang.value == 'zh' ? '查看使用详情' : 'View usage details'} </button>
            </div>`
        },
      },
      legend: {
        top: '15%',
        textStyle: {
          color: '#fff',
        },
        data: [
          '666',
          '510',
          '507',
          '508',
          '509',
          '501',
          '506',
          '503',
          '502',
        ],
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick: {
          show: false,
        },
        data: ['0', '0', '0', '0', '0', '0', '0', '0', '0'],
      },

      yAxis: {
        type: 'value',
        postition: 'left',
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: '{value} min',
        },
        //data: info.yList
      },
      series: [
        {
          name: '666',
          type: 'line',
          silent: true,
          stack: 'Total1',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,

          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(254, 172, 104, 0.5)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '510',
          type: 'line',
          silent: true,
          stack: 'Total2',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(60, 207, 228, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '507',
          type: 'line',
          silent: true,
          stack: 'Total3',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(60, 207, 228, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '508',
          type: 'line',
          silent: true,
          stack: 'Total4',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(60, 25, 228, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '509',
          type: 'line',
          silent: true,
          stack: 'Total5',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(60, 207, 55, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '501',
          type: 'line',
          silent: true,
          stack: 'Total6',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(60, 207, 12, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '506',
          type: 'line',
          silent: true,
          stack: 'Total7',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(158, 150, 150, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '503',
          type: 'line',
          silent: true,
          stack: 'Total8',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(12, 222, 228, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '502',
          type: 'line',
          silent: true,
          stack: 'Total9',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(60, 11, 151, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
    }
    const option3 = {
      title: {
        text: t('other.toiletOccupancyByTime'),
        textStyle: {
          color: '#fff',
        },
      },
      color: ['#DA6D73', '#3CCFE4', '#d37ec8', '#689cd1'],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '1%',
        top: '25%',
        containLabel: true,
      },
      tooltip: {
        // 鼠标是否可以进入悬浮框
        enterable: true,
        // 触发方式 mousemove, click, none, mousemove|click
        triggerOn: `click`,
        // item 图形触发， axis 坐标轴触发， none 不触发
        trigger: `axis`,
        // 浮层隐藏的延迟
        hideDelay: 800,
        // 背景色
        backgroundColor: `rgba(64,106,163,0.65)`,
        formatter: function (params: any) {
          selectData.value = moment(params[0].axisValue).format('YYYY-MM-DD')
          return `<div id="chartLabel" class="chartLabel">
                  <div class="data">${params[0].axisValue}：</div>
          ${params
            .map((item: any) => {
              return `<div class="charts-item">
                    <span class="title">${item.seriesName}</span>
                    <span class="label">${item.data}</span>
                    </div>`
            })
            .join(' ')}
            </div>`
        },
      },
      legend: {
        top: '15%',
        textStyle: {
          color: '#fff',
        },
        data: [t('other.manNorth'), t('other.womanNorth'), t('other.manSouth'), t('other.womanSouth')],
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick: {
          show: false,
        },
        data: [
          '00:00',
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
          '14:00',
          '15:00',
          '16:00',
          '17:00',
          '18:00',
          '19:00',
          '20:00',
          '21:00',
          '22:00',
          '23:00',
        ],
      },

      yAxis: {
        type: 'value',
        postition: 'left',
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: '{value} min',
        },
        //data: info.yList
      },
      series: [
        {
          name: t('other.manNorth'),
          type: 'line',
          silent: true,
          stack: 'Total1',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,

          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(254, 172, 104, 0.5)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0,
          ],
        },
        {
          name: t('other.womanNorth'),
          type: 'line',
          silent: true,
          stack: 'Total2',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(60, 207, 228, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0,
          ],
        },
        {
          name: t('other.manSouth'),
          type: 'line',
          silent: true,
          stack: 'Total3',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(60, 207, 228, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0,
          ],
        },
        {
          name: t('other.womanSouth'),
          type: 'line',
          silent: true,
          stack: 'Total4',
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(60, 25, 228, 0.1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0,
          ],
        },
      ],
    }
    return {
      dataStart,
      dataEnd,
      drawerFlag,
      close,
      changeType,
      selectType,
      getDataLimit,
      getDurationData,
      setEchartsData,
      closeTab,
      setOption,
      drawerTitle,
      selectData,
      loadingStatue,
      type,
      option3,
      setToilet,
      lang,
      t
    }
  },
})
</script>
<style lang="less" scoped>
.report-body {
  background-color: #091123;
  transform-origin: 0 0;
  position: absolute;
  width: 1920px;
  height: 1080px;
  .report-contant {
    padding: 50px;
  }
}
.myChart {
  width: 900px;
  height: 400px;
  margin: 0 auto;
  margin-top: 40px;
}
.block {
  margin-top: 40px;
  margin-bottom: 40px;
  .demonstration {
    margin-right: 20px;
    color: #fff;
  }
}

/deep/.chartLabel {
  color: #2dc9d9;
  .data {
    line-height: 30px;
    color: #71888b;
  }
  .charts-item {
    height: 28px;
  }
  #btn-tooltip {
    background-color: #2dc9d9;
    border: 0px;
    width: 100%;
    cursor: pointer;
  }
}
.primary {
  background-color: #409eff;
  color: #fff;
  border: 0px;
}
</style>
