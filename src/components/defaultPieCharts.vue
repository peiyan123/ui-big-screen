<template>
  <div :id="id"></div>
</template>

<script>
// 引入echarts
import * as echarts from 'echarts'
import { onMounted, ref, watch, unref } from 'vue'
export default {
  setup(props, context) {
    const id = ref('')
    const info = unref(context.attrs.info)
    onMounted(() => {
      // 需要获取到element,所以是onMounted的Hook
      id.value = context.attrs.id
      document.getElementById(id.value).style.width =
        (context.attrs.width ? context.attrs.width : 150) + 'px'
      document.getElementById(id.value).style.height =
        (context.attrs.height ? context.attrs.height : 150) + 'px'
      init()
    })
    const option = {
      title: [
        {
          text: [
            `{a|${info.current ? info.current : 0}}`,
            `{b|${info.unit !== undefined ? info.unit : '/' + info.max}}`,
          ].join(''),
          textStyle: {
            color: info.color ? info.color : '#4DBFFF',
            rich: {
              a: {
                fontSize: 24,
              },
              b: {
                fontSize: 12,
                padding: [11, 0, 5, 3],
              },
            },
            fontSize: 14,
          },
          subtext: info.subtext ? info.subtext : '',
          subtextStyle: {
            color: info.color ? info.color : '#4DBFFF',
            fontSize: 12,
          },
          itemGap: 8, // 主副标题距离
          left: 'center',
          top: info.subtext ? '25%' : '30%',
        },
        {
          text: info.title ? info.title : '',
          textStyle: {
            color: '#FFFFFF',
            fontSize: 14,

          },
          itemGap: 4, // 主副标题距离
          left: 'center',
          top: '80%',
        },
      ],
      angleAxis: {
        max: info.max ? info.max : 100, // 满分
        clockwise: true, // 逆时针
        // 隐藏刻度线
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      radiusAxis: {
        type: 'category',
        // 隐藏刻度线
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      polar: {
        center: ['50%', '40%'],
        radius: '160%', //图形大小
      },
      series: [
        {
          type: 'bar',
          data: [
            {
              value: info.current ? info.current : 0,
              itemStyle: {
                //normal: {
                color: info.color ? info.color : '#4DBFFF',
                // },
              },
            },
          ],
          coordinateSystem: 'polar',
          roundCap: true,
          barWidth: 10,
          barGap: '-80%', // 两环重叠
          z: 2,
        },
        {
          // 灰色环
          type: 'bar',
          data: [
            {
              value: info.max ? info.max : 100,
              itemStyle: {
                color: '#1B2B44',
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowBlur: 5,
                shadowOffsetY: 2,
              },
            },
          ],
          coordinateSystem: 'polar',
          roundCap: true,
          barWidth: 10,
          barGap: '-100%', // 两环重叠
          z: 1,
        },
      ],
    }
    watch(
      () => context.attrs.info,
      () => {
        let info = context.attrs.info
        option.series[0].data[0].value = info.current
        option.series[1].data[0].value = info.max
        option.angleAxis.max = info.max
        option.title[0].text = [
          `{a|${info.current}}`,
          `{b|${info.unit ? info.unit : '/' + info.max}}`,
        ].join('')
        option.title[0].textStyle.color = info.color
        option.title[0].subtext = info.subtext ? info.subtext : ''
        option.title[0].top = info.subtext ? '25%' : '30%'
        option.title[1].text = info.title ? info.title : ' '
        option.series[0].data[0].itemStyle.color = info.color || '#4DBFFF'
        option.title[0].subtextStyle.color = info.color || '#4DBFFF'
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
