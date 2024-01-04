<template>
  <div :id="id"></div>
</template>

<script>
// 引入双色柱状图
import * as echarts from 'echarts'
import { onMounted, ref, watch, unref } from 'vue'
import {useI18n} from "vue-i18n";
export default {
  setup(props, context) {
    const id = ref('')
    const info = unref(context.attrs.barInfo)
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
      color: ['rgba(25, 177, 176, 1)', 'rgba(15, 110, 206, 1)'],
      xAxis: {
        type: 'category',
        axisLabel: {
          interval: 0,
          //textStyle: {
          fontSize: 9,
          // },
        },
        data: info.xList,
        axisTick: {
          show: false,
        },
      },
      tooltip: {
        trigger: 'item',
        // axisPointer: {
        //   type: 'cross', //指示类型
        //   label: {
        //     // 横纵坐标指示区块颜色
        //     backgroundColor: '#6a7985',
        //   },
        // },
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
      grid: {
        left: '3%',
        right: '4%',
        bottom: '1%',
        top: '14%',
        containLabel: true,
      },
      yAxis: {
        type: 'value',
        show: true,
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          data: info.data,
          name: t('other.personTime'),
          type: 'bar',
          showBackground: true,
          barWidth: 10,
          itemStyle: {
            //normal: {
            // 这里的color指的是每个颜色的回调函数
            color: function (params) {
              // if (info.color) {
              //   var colorArr = info.color //colorArr.length 为3，通过取模的方式就可以循环使用颜色了
              // } else {
              //   var colorArr = [
              //     'rgba(25, 177, 176, 1)',
              //     'rgba(15, 110, 206, 1)',
              //   ]
              // }
              // return colorArr[params.dataIndex % 2]
              return info.color[0]
            },
            // },
          },
          backgroundStyle: {
            color: 'rgba(27, 43, 68, 1)',
          },
        },
        {
          data: info.data1,
          type: 'bar',
          name: t('other.numberOfPeople'),
          showBackground: true,
          barWidth: 10,
          itemStyle: {
            //normal: {
            // 这里的color指的是每个颜色的回调函数
            color: function (params) {
              return info.color[1]
            },
            // },
          },
          backgroundStyle: {
            color: 'rgba(27, 43, 68, 1)',
          },
        },
      ],
    }
    watch(
      () => context.attrs.barInfo,
      () => {
        option.series[0].data = context.attrs.barInfo.data
        option.series[1].data = context.attrs.barInfo.data1
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
              debugger
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
