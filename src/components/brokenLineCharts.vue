<template>
  <div :id="id"
       class="myChart"></div>
</template>

<script>
// 引入折线图
import * as echarts from 'echarts'
import { onMounted, ref, watch, unref } from 'vue'
import {useI18n} from "vue-i18n";
export default {
  setup(props, context) {
    const id = ref('')
    const info = unref(context.attrs.historyInfo)
    const { t, locale } = useI18n();
    onMounted(() => {
      // 需要获取到element,所以是onMounted的Hook
      id.value = context.attrs.id
      document.getElementById(id.value).style.width =
        (context.attrs.width ? context.attrs.width : 500) + 'px'
      document.getElementById(id.value).style.height =
        (context.attrs.height ? context.attrs.height : 150) + 'px'
      init()
    })
    const option = {
      color: ['#36e09e', 'rgba(15, 110, 206, 1)'],
      xAxis: {
        type: 'category',
        data: info.xList,
        boundaryGap: false,
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          // textStyle: {
          fontSize: 9,
          // },
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '0%',
        right: '8%',
        bottom: '5%',
        top: '5%',
        containLabel: true,
      },
      yAxis: {
        min: 0,
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLine: { onZero: true },
      },
      legend: {
        data: [t('other.personTime'), t('other.numberOfPeople')],
        itemGap: 2,
        top: '-2',
        right: '0',
        itemWidth: 5, //标志图形的长度
        itemHeight: 5, //标志图形的宽度
        textStyle: {
          //图例⽂字的样式
          color: '#fff',
          fontSize: 14,
        },
      },
      series: [
        {
          symbol: 'none',
          data: info.data,
          name: t('other.personTime'),
          type: 'line',
          silent: true,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#36e09e',
              },
              {
                offset: 1,
                color: 'rgba(60, 207, 228, 0.1)',
              },
            ]),
          },
        },
        {
          symbol: 'none',
          data: info.data1,
          type: 'line',
          name: t('other.numberOfPeople'),
          silent: true,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 1)',
              },
              {
                offset: 1,
                color: 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
        },
      ],
    }
    watch(
      () => context.attrs.historyInfo,
      () => {
        option.series[0].data = context.attrs.historyInfo.data
        option.series[1].data = context.attrs.historyInfo.data1
        option.xAxis.data = context.attrs.historyInfo.xList
        //let myChart = echarts.init(document.getElementById(id.value))
        let myChart = echarts.getInstanceByDom(
          document.getElementById(id.value)
        )
        myChart.setOption(option, true)
      },
      {
        deep: true, // 深度监听的参数
      }
    )
    watch(
            () => locale.value,
            () => {
              option.series[0].name = t('other.personTime')
              option.series[1].name = t('other.numberOfPeople')
              option.legend.data = [t('other.personTime'), t('other.numberOfPeople')]
              let myChart = echarts.getInstanceByDom(
                      document.getElementById(id.value)
              )
              myChart.setOption(option, true)
            }
    )
    function init() {
      let myChart = echarts.init(document.getElementById(id.value))
      // 绘制图表
      myChart.setOption(option, true)
    }
    return {
      id,
      init,
      info,
      t
    }
  },
}
</script>
<style lang="less" scoped>
.myChart {
  .chart-title {
    text-align: center;
  }
}
</style>
