<template>
  <div class="container-border">
    <div class="regional_body">
      <div class="left">
        <TitleHeader :text="'title.regionalCongestion'"></TitleHeader>
        <div class="pie_list">
          <div v-for="item, index in  dataInfo.slice(0, 2)"
               :key="index">
            <DefaultPieCharts @click="openDialog(item.current, index)"
                              :height="150"
                              :width="120"
                              :info="item"
                              :id='`pie_reaional_${index}`'></DefaultPieCharts>
          </div>
          <!-- <DefaultPieCharts @click="openDialog(info_1.current)"
                            :height="150"
                            :width="120"
                            :info="info_1"
                            :id="'pie_reaional_1'"></DefaultPieCharts>
          <DefaultPieCharts @click="openDialog(info_2.current)"
                            :height="150"
                            :width="120"
                            :info="info_2"
                            :id="'pie_reaional_2'"></DefaultPieCharts> -->
        </div>
        <div class="pie_list">
          <div v-for="item, index in  dataInfo.slice(-2)"
               :key="index">
            <DefaultPieCharts @click="openDialog(item.current, index)"
                              :height="150"
                              :width="120"
                              :info="item"
                              :id='`pie_reaional_${index + 2}`'></DefaultPieCharts>
          </div>
          <!-- <DefaultPieCharts @click="openDialog(info_3.current)"
                            :height="150"
                            :width="120"
                            :info="info_3"
                            :id="'pie_reaional_3'"></DefaultPieCharts>
          <DefaultPieCharts @click="openDialog(info_4.current)"
                            :height="150"
                            :width="120"
                            :info="info_4"
                            :id="'pie_reaional_4'"></DefaultPieCharts> -->
        </div>
      </div>
      <div class="right">
        <div class="right_top">
          <div class="people_num">
            <TitleHeader :text="'title.peopleInnSpace'"></TitleHeader>
            <BarCharts :barInfo="barInfo"
                       :height="160"
                       :width="400"
                       :id="'bar_reaional_1'"></BarCharts>
          </div>
          <div class="people_img">
            <TitleHeader :text="'title.recentEmployeeEntry'"></TitleHeader>
            <div class="people_img_list">
              <div class="img_item"
                   v-for="item, index in people_img_list"
                   :key="index">
                <img class="img"
                     :src="'http://ib.thundercomm.com:4002' + item.visitPicture"
                     alt="">
                <div class="name">
<!--                  {{ item.name }}-->
                  <span>{{item.isCard ? ('（' + $t('other.cardSwiping') + '）') : ('（' + $t('other.faceSwiping') + '）')}}</span> </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right_bottom">
          <div class="right_bottom_1">
            <TitleHeader :text="'title.numberOfVisitors'"></TitleHeader>
            <div class="come_people_num"> <span class="totalPeople">{{ totalPeople }}</span> / <span class="totalNum">{{ totalNum }}</span></div>
          </div>
          <div class="right_bottom_2">
            <TitleHeader :text="'title.numberOfHistorical'"></TitleHeader>
            <BrokenLineCharts :historyInfo="historyInfo"
                              :height="125"
                              :width="475"
                              :id="'broken_line_1'"></BrokenLineCharts>
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
import TitleHeader from './titleHeader.vue'
import DefaultPieCharts from '@/components/defaultPieCharts.vue'
import BarCharts from '@/components/barCharts.vue'
import BrokenLineCharts from '@/components/brokenLineCharts.vue'
import dataJson from '@/json/dataConfig.json'
import { get, post } from '@/utils/axios'
import {useI18n} from "vue-i18n";
export default defineComponent({
  components: {
    TitleHeader,
    DefaultPieCharts,
    BarCharts,
    BrokenLineCharts,
  },
  emit: ['openDialog', 'resetToken'],
  setup(props, context: any) {
    const totalNum = ref('')
    const totalPeople = ref('')
    const wrongList = ref<any>([])
    const { t, locale } = useI18n();
    const dataInfo: any = ref([
      {
        current: 0,
        unit: '%',
        color: getColor(0),
        max: 100,
        title: t('other.region1'),
        subtext: getStatus(0),
      },
      {
        current: 0,
        unit: '%',
        color: getColor(0),
        max: 100,
        title: t('other.region2'),
        subtext: getStatus(0),
      },
      {
        current: 0,
        unit: '%',
        color: getColor(0),
        max: 100,
        title: t('other.region3'),
        subtext: getStatus(0),
      },
      {
        current: 0,
        unit: '%',
        color: getColor(0),
        max: 100,
        title: t('other.region4'),
        subtext: getStatus(0),
      },
    ])
    const changeData = ref()
    // 柱状图内容
    const barInfo = reactive({
      xList: [
        t('other.before'),
        '9:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        t('other.after'),
      ],
      color: ['#36e09e', 'rgba(15, 110, 206, 1)'],
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      data1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    })
    const historyInfo = reactive({
      xList: [],
      color: 'rgba(56, 192, 212, 0.2)',
      bottomColor: 'rgba(27, 25, 38, 0.05)',
      data: [],
      data1: [],
    })
    const people_img_list = ref<any>([])
    function getColor(data: number) {
      if (data > 75) {
        return '#EF555A'
      } else if (data > 50) {
        return '#FEAC68'
      } else if (data > 25) {
        return '#4DBFFF'
      } else {
        return '#36E09E'
      }
    }
    function getStatus(data: any) {
      if (data > 75) {
        return t('other.crowding')
      } else if (data > 50) {
        return t('other.moreCrowded')
      } else if (data > 25) {
        return t('other.normal')
      } else {
        return t('other.noCrowding')
      }
    }
    onMounted(() => {})
    function getZhiDaNum() {
      getHourNum()
      getMonthNum()
    }
    watch(
            () => locale.value,
            () => {
              dataInfo.value[0].title = t('other.region1')
              dataInfo.value[1].title = t('other.region2')
              dataInfo.value[2].title = t('other.region3')
              dataInfo.value[3].title = t('other.region4')
              barInfo.xList[0] = t('other.before')
              barInfo.xList[11] = t('other.after')
              changeFun()
            }
    )
    // 获取当天的访客数
    function getHourNum() {
      get('/aiot/screen/employee_visitor_day').then((res: any) => {
        // totalNum.value = res.data.sum
        // totalPeople.value = res.data.sumPeople
        people_img_list.value = res.data.recently
        let data = res.data.visitor.splice(9, 10)
        let beforeData = res.data.visitor.slice(0, 9)
        let beforeCount = 0
        let beforeCount1 = 0
        beforeData.forEach((item: any) => {
          beforeCount = beforeCount + item.visitorNum
          beforeCount1 = beforeCount1 + item.visitorPeople
        })
        let afterData = res.data.visitor.slice(-5)
        let afterCount = 0
        let afterCount1 = 0
        afterData.forEach((item: any) => {
          afterCount = afterCount + item.visitorNum
          afterCount1 = afterCount1 + item.visitorPeople
        })
        let arr: any = []
        let arr1: any = []
        data.forEach((item: any) => {
          arr.push(item.visitorNum)
          arr1.push(item.visitorPeople)
        })
        barInfo.data = arr
        barInfo.data1 = arr1
        barInfo.data.unshift(beforeCount)
        barInfo.data.push(afterCount)
        barInfo.data1.unshift(beforeCount1)
        barInfo.data1.push(afterCount1)
      })
    }
    // 获取近15日 人数
    function getMonthNum() {
      get('/aiot/screen/employee_visitor_month').then((res: any) => {
        let data = res.data
        let arrX: any = []
        let arrY: any = []
        let arrY1: any = []
        data.forEach((item: any, index: any) => {
          if (index === 0) {
            totalNum.value = item.visitorNum
            totalPeople.value = item.visitorPeople
          } else {
            arrX.push(item.date.slice(5).replace('-', '/'))
            arrY.push(item.visitorNum)
            arrY1.push(item.visitorPeople)
          }
        })
        historyInfo.xList = arrX
        historyInfo.data = arrY
        historyInfo.data1 = arrY1
      })
    }
    onBeforeUnmount(() => {})
    watch(
      () => context.attrs.regionalInfo,
      () => {
        let data = context.attrs.regionalInfo
        changeData.value = context.attrs.regionalInfo
        changeFun()
      }
    )
    function changeFun() {
      wrongList.value = []
      debugger
      if (Object.keys(changeData.value || []).length > 0) {
        // Object.keys(changeData.value || []).forEach((item: any) => {
        //   let alertIndex = item.charAt(8)
        //   let numAlermIndex = Number(alertIndex) - 1
        //   wrongList.value.push(numAlermIndex)
        //   dataInfo.value[numAlermIndex].current = Math.trunc(
        //           (JSON.parse(changeData.value[item][0].details.algResult).length / 3) * 100
        //   )
        //   dataInfo.value[numAlermIndex].color = getColor(
        //           dataInfo.value[numAlermIndex].current
        //   )
        //   dataInfo.value[numAlermIndex].subtext = getStatus(
        //           dataInfo.value[numAlermIndex].current
        //   )
        // })
        debugger
        if (changeData.value.cameraId == 'RTSP-ff808181855163dc0185535f4e380005') {
               dataInfo.value[0].current = Math.trunc(
                  (JSON.parse(changeData.value.data.algResult)['people-count'] / 3) * 100
          )
          dataInfo.value[0].color = getColor(
                  dataInfo.value[0].current
          )
          dataInfo.value[0].subtext = getStatus(
                  dataInfo.value[0].current
          )
          setTimeout(() => {
            dataInfo.value[0].current = 0
            dataInfo.value[0].color = getColor(0)
            dataInfo.value[0].subtext = getStatus(0)
          }, 5000)
        } else if (changeData.value.cameraId == 'RTSP-ff8081818556ce070185573c4cbd0000') {
          dataInfo.value[1].current = Math.trunc(
                  (JSON.parse(changeData.value.data.algResult)['people-count'] / 3) * 100
          )
          dataInfo.value[1].color = getColor(
                  dataInfo.value[1].current
          )
          dataInfo.value[1].subtext = getStatus(
                  dataInfo.value[1].current
          )
          setTimeout(() => {
            dataInfo.value[1].current = 0
            dataInfo.value[1].color = getColor(0)
            dataInfo.value[1].subtext = getStatus(0)
          }, 5000)
        } else if (changeData.value.cameraId == 'RTSP-ff808181855163dc0185535fc9f70008') {
          dataInfo.value[2].current = Math.trunc(
                  (JSON.parse(changeData.value.data.algResult)['people-count'] / 3) * 100
          )
          dataInfo.value[2].color = getColor(
                  dataInfo.value[2].current
          )
          dataInfo.value[2].subtext = getStatus(
                  dataInfo.value[2].current
          )
          setTimeout(() => {
            dataInfo.value[2].current = 0
            dataInfo.value[2].color = getColor(0)
            dataInfo.value[2].subtext = getStatus(0)
          }, 5000)
        }else if (changeData.value.cameraId == 'RTSP-ff808181855163dc0185535f9ed90007') {
          dataInfo.value[3].current = Math.trunc(
                  (JSON.parse(changeData.value.data.algResult)['people-count'] / 3) * 100
          )
          dataInfo.value[3].color = getColor(
                  dataInfo.value[3].current
          )
          dataInfo.value[3].subtext = getStatus(
                  dataInfo.value[3].current
          )
          setTimeout(() => {
            dataInfo.value[3].current = 0
            dataInfo.value[3].color = getColor(0)
            dataInfo.value[3].subtext = getStatus(0)
          }, 5000)
        }
      }
      // for (let index = 0; index < 4; index++) {
      //   if (!wrongList.value.includes(index)) {
      //     dataInfo.value[index].current = 0
      //     dataInfo.value[index].color = getColor(0)
      //     dataInfo.value[index].subtext = getStatus(0)
      //   }
      // }
    }
    function openDialog(current: number, index: any) {
      if (current > 50) {
        let name = 'location' + (index + 1)
        context.emit('openDialog', context.attrs.regionalInfo[name][0])
      }
    }
    return {
      barInfo,
      dataInfo,
      historyInfo,
      people_img_list,
      openDialog,
      totalNum,
      totalPeople,
      getColor,
      getStatus,
      getHourNum,
      getMonthNum,
      getZhiDaNum,
      wrongList,
      changeData,
      changeFun,
      t
    }
  },
})
</script>
<style lang="less" scoped>
.container-border {
  width: 998px;
  .regional_body {
    display: flex;
    .left {
      width: 295px;
      margin-top: 18px;
      padding: 0 18px;
      border-right: 1px solid #091b33;
      margin-bottom: 25px;
      .pie_list {
        margin-top: 35px;
        display: flex;
        justify-content: space-between;
      }
    }
    .right {
      width: 700px;
      .right_top {
        height: 195px;
        width: 682px;
        display: flex;
        margin: 18px 0 0 18px;
        border-bottom: 1px solid #091b33;
        padding-bottom: 10px;
        .people_num {
          width: 422px;
          height: 100%;
        }
        .people_img {
          width: 260px;
          height: 100%;
          padding-left: 18px;
          border-left: 1px solid #091b33;
          .people_img_list {
            display: flex;
            justify-content: flex-start;
            .img_item {
              margin-right: 25px;
              .img {
                width: 100px;
                height: 125px;
              }
              .name {
                color: #ffffff;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 100px;
                font-size: 12px;
                span {
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
      .right_bottom {
        display: flex;
        height: 210px;
        .right_bottom_1 {
          width: 189px;
          height: 169px;
          margin: 18px 15px;
          border-right: 1px solid #091b33;
          .come_people_num {
            background: url('@/assets/jinma/people_num_bg.png') no-repeat;
            width: 105px;
            height: 105px;
            margin: 0 auto;
            text-align: center;
            line-height: 105px;
            font-size: 19px;
            color: #ffffff;
            text-shadow: 0px 4px 5px rgba(17, 149, 152, 0.82);
            font-weight: 600;
            margin-top: -20px;
          }
        }
        .right_bottom_2 {
          width: 510px;
          margin: 18px;
        }
      }
    }
  }
}
#bar_reaional_1 {
  margin-top: -15px;
}
.totalPeople {
  color: rgba(15, 110, 206, 1);
}
.totalNum {
  color: #36e09e;
}
</style>
