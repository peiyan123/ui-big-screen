<template>
  <div :id="id"
       class="myChart"></div>
</template>

<script>
// 双环形图
import * as echarts from 'echarts'
import { onMounted, ref, watch, unref } from 'vue'
export default {
  setup(props, context) {
    const id = ref('')
    // info里面的color和current传值顺序从内向外
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
    let BorderWidth = '6'
    //反方向剩下部分的样式
    let placeHolderStyle = {
      //normal: {
      label: {
        show: false,
        position: 'center',
      },
      labelLine: {
        show: false,
      },
      color: '#1b2b44',
      borderColor: '#1b2b44',
      barBorderRadius: 0,
      borderWidth: 6,
      //},
    }

    const option = {
      color: info.color ? info.color : ['#0F6ECE', '#14C6CA'],
      // legend: {
      //   top: 'bottom',
      //   left: 'center',
      //   icon: 'circle',
      //   itemHeight: 5,
      //   itemWidth: 5,
      //   textStyle: {
      //     color: '#FFFFFF',
      //     fontSize: 11,
      //   },
      // },
      title: {
        text: info.current[0] + info.current[1],
        textStyle: {
          color: '#FFFFFF',
          fontSize: 24,
        },
        subtext: info.subtext ? info.subtext : '总数',
        subtextStyle: {
          color: '#FFFFFF',
          fontSize: 14,
        },
        itemGap: 5, // 主副标题距离
        left: 'center',
        top: '35%',
      },
      series: [
        {
          // 外侧
          type: 'pie',
          silent: true,
          // angleAxis: {
          //     max: 200,
          // },
          clockWise: false, //顺时加载
          emphasis: false, //鼠标移入变大
          label: {
            show: false,
          },
          radius: ['95%', '96%'],
          itemStyle: {
            //normal: {
            label: {
              show: false,
              position: 'outside',
            },
            labelLine: {
              show: false,
              smooth: 0.5,
            },
            borderWidth: BorderWidth,
            shadowBlur: 40,
            borderColor: info.color ? info.color[0] : '#0F6ECE',
            // },
          },
          data: [
            {
              value: info.max[0] - info.current[0],
              itemStyle: placeHolderStyle,
            },
            {
              value: info.current[0],
              name: ' 人数',
            },
          ],
        },
        {
          // 内测
          type: 'pie',
          silent: true,
          clockWise: false,
          emphasis: false,
          radius: ['70%', '71%'],
          label: {
            show: false,
          },
          itemStyle: {
            //normal: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
              smooth: 0.5,
            },
            borderWidth: BorderWidth,
            shadowBlur: 40,
            borderColor: info.color ? info.color[1] : '#14C6CA',
            //},
          },
          data: [
            {
              value: info.max[1] - info.current[1],
              itemStyle: placeHolderStyle,
            },
            {
              value: info.current[1],
              name: '入11厕',
            },
          ],
        },
      ],
    }

    watch(
      () => context.attrs.info,
      () => {
        option.series[0].data[0].value =
          context.attrs.info.max[0] - context.attrs.info.current[0]
        option.series[0].data[1].value = context.attrs.info.current[0]
        option.series[1].data[0].value =
          context.attrs.info.max[1] - context.attrs.info.current[1]
        option.series[1].data[1].value = context.attrs.info.current[1]
        option.title.text =
          context.attrs.info.current[1] + context.attrs.info.current[0]
         option.title.subtext = context.attrs.info.subtext
        // let myChart = echarts.init(document.getElementById(id.value))
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
  margin: 0 auto;
  .chart-title {
    text-align: center;
  }
}
</style>
