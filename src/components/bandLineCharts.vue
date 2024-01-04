<template>
  <div :id="id"
       class="myChart"></div>
</template>

<script>
// 引入双曲线图
import * as echarts from 'echarts'
import { onMounted, ref, watch, unref } from 'vue'
export default {
  setup(props, context) {
    const id = ref('')
    const info = unref(context.attrs.energyInfo)
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
      color: ['#DA6D73', '#3CCFE4'],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '1%',
        top: '5%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick: {
          show: false,
        },
        data: info.xList,
      },

      yAxis: {
        type: 'value',
        postition: 'left',
        splitLine: {
          show: false,
        },
        //data: info.yList
      },

      series: [
        {
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
                color:
                  info.color.length > 0
                    ? info.color[0]
                    : 'rgba(254, 172, 104, 0.5)',
              },
              {
                offset: 1,
                color:
                  info.bottomColor.length > 0
                    ? info.bottomColor[0]
                    : 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: info.data1,
        },
        {
          name: 'Line 2',
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
                color:
                  info.color.length > 0
                    ? info.color[1]
                    : 'rgba(60, 207, 228, 0.1)',
              },
              {
                offset: 1,
                color:
                  info.bottomColor.length > 0
                    ? info.bottomColor[1]
                    : 'rgba(27, 25, 38, 0.15)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: info.data2,
        },
      ],
    }
    watch(
      () => context.attrs.energyInfo.data1,
      () => {
        option.series[0].data = context.attrs.energyInfo.data1
        // option.series[1].data = context.attrs.energyInfo.data2
        let myChart = echarts.getInstanceByDom(
          document.getElementById(id.value)
        )
        // if (!document.getElementById(id.value)) {
        //   myChart = echarts.init(document.getElementById(id.value))
        // }
        myChart.setOption(option, true)
      }
      // () => context.attrs.energyInfo.data2,
      // () => {
      //   let myChart = echarts.getInstanceByDom(
      //     document.getElementById(id.value)
      //   )
      //   option.series[1].data = context.attrs.energyInfo.data2
      //   // let myChart = echarts.init(document.getElementById(id.value))
      //   myChart.setOption(option, true)
      // }
    )
    function init() {
      let myChart = echarts.init(document.getElementById(id.value))
      // 绘制图表
      myChart.setOption(option, true)
    }
    return {
      id,
      init,
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