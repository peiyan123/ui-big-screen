<template>
  <div class="container-border">
    <div class="container-title">{{ $t("title.outWeather") }}</div>
    <div class="weather-list">
      <div class="today-weather">
        <div>
          <img class="weather-img-1"
               :src="getImg(nowDateList.weatherState)"
               alt="">
        </div>
        <div class="today-text">
          <div v-if="nowDateList.temperatureLow"
               class="font"><span class="current_t">{{ nowDateList.temperatureNow }}</span>℃</div>
          <div v-if="nowDateList.temperatureLow"
               class="font">{{ nowDateList.temperatureLow }}°~{{ nowDateList.temperatureHigh }}°</div>
          <div class="font">{{getStatus(nowDateList.weatherState)}}</div>
        </div>
      </div>
      <div v-for="(item, index) in lists"
           :key="index"
           class="weather">
        <div class="font">
          <img class="img"
               :src="getImg(item.weatherState)"
               alt="">
        </div>
        <div class="font">{{getStatus(item.weatherState)}}</div>
        <div v-if="item.temperatureLow"
             class="font">{{ item.temperatureLow }}°~{{ item.temperatureHigh }}°</div>
        <div class="font">{{item.date}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import axios from '@/utils/axios'
import sunny from '@/assets/jinma/sunny.png'
import cloudy from '@/assets/jinma/cloudy.png'
import lightSnow from '@/assets/jinma/light-snow.png'
import overcast from '@/assets/jinma/overcast.png'
import heavyRain from '@/assets/jinma/heavy-rain.png'
import snowShower from '@/assets/jinma/snow-shower.png'
import lightRain from '@/assets/jinma/light-rain.png'
import shower from '@/assets/jinma/shower.png'
import moderateRain from '@/assets/jinma/moderate-rain.png'
import moderateSnow from '@/assets/jinma/moderate-snow.png'
import heavySnow from '@/assets/jinma/heavy-snow.png'
import rainstorm from '@/assets/jinma/rainstorm.png'
import blizzard from '@/assets/jinma/blizzard.png'
import bigHeavyRain from '@/assets/jinma/big-heavy-rain.png'
import thunderShower from '@/assets/jinma/thunder-shower.png'
import sleet from '@/assets/jinma/sleet.png'
import haze from '@/assets/jinma/haze.png'
import floatingDust from '@/assets/jinma/floating_dust.png'
import yangSha from '@/assets/jinma/yang_Sha.png'
import sandStorm from '@/assets/jinma/sand_storm.png'
import fog from '@/assets/jinma/fog.png'
import { useI18n } from "vue-i18n";
export default defineComponent({
  components: {},
  setup(props, context: any) {
    const lists = ref<any>([{}])
    const nowDateList = ref<any>([{}])
    const { t, locale } = useI18n();
    onMounted(() => {
    })
    function getImg(img: string) {
      let dayImg
      switch (img) {
        case '多云':
          dayImg = cloudy //多云
          break
        case '小雪':
          dayImg = lightSnow // 小雪
          break
        case '阴':
          dayImg = overcast // 阴天
          break
        case '大雨':
          dayImg = heavyRain // 大雨
          break
        case '阵雪':
          dayImg = snowShower // 阵雪
          break
        case '小雨':
          dayImg = lightRain // 小雨
          break
        case '阵雨':
          dayImg = shower // 阵雨
          break
        case '中雨':
          dayImg = moderateRain // 中雨
          break
        case '中雪':
          dayImg = moderateSnow // 中雪
          break
        case '大雪':
          dayImg = heavySnow // 大雪
          break
        case '暴雨':
          dayImg = rainstorm // 暴雨
          break
        case '暴雪':
          dayImg = blizzard // 暴雪
          break
        case '大暴雨':
          dayImg = bigHeavyRain // 大暴雨
          break
        case '雷阵雨':
          dayImg = thunderShower // 雷阵雨
          break
        case '雨夹雪':
          dayImg = sleet // 雨夹雪
          break
        case '晴':
          dayImg = sunny // 晴天
          break
        case '浮尘':
          dayImg = floatingDust // 浮尘
          break
        case '扬沙':
          dayImg = yangSha // 扬沙
          break
        case '沙尘暴':
          dayImg = sandStorm // 沙尘暴
          break
        case '雾':
          dayImg = fog // 雾
          break
        case '霾':
          dayImg = haze // 霾
          break
      }
      return dayImg
    }
    function getStatus (data: any) {
      let name
      switch (data) {
        case '多云':
          name = 'weatherType.cloudy' //多云
          break
        case '小雪':
          name = 'weatherType.lightSnow' // 小雪
          break
        case '阴':
          name = 'weatherType.overcast' // 阴天
          break
        case '大雨':
          name = 'weatherType.heavyRain' // 大雨
          break
        case '阵雪':
          name = 'weatherType.snowShower' // 阵雪
          break
        case '小雨':
          name = 'weatherType.lightRain' // 小雨
          break
        case '阵雨':
          name = 'weatherType.shower' // 阵雨
          break
        case '中雨':
          name = 'weatherType.moderateRain' // 中雨
          break
        case '中雪':
          name = 'weatherType.moderateSnow' // 中雪
          break
        case '大雪':
          name = 'weatherType.heavySnow' // 大雪
          break
        case '暴雨':
          name = 'weatherType.rainstorm' // 暴雨
          break
        case '暴雪':
          name = 'weatherType.blizzard' // 暴雪
          break
        case '大暴雨':
          name = 'weatherType.bigHeavyRain' // 大暴雨
          break
        case '雷阵雨':
          name = 'weatherType.thunderShower' // 雷阵雨
          break
        case '雨夹雪':
          name = 'weatherType.sleet' // 雨夹雪
          break
        case '晴':
          name = 'weatherType.sunny' // 晴天
          break
        case '浮尘':
          name = 'weatherType.floatingDust' // 浮尘
          break
        case '扬沙':
          name = 'weatherType.yangSha' // 扬沙
          break
        case '沙尘暴':
          name = 'weatherType.sandStorm' // 沙尘暴
          break
        case '雾':
          name = 'weatherType.fog' // 雾
          break
        case '霾':
          name = 'weatherType.haze' // 霾
          break
        default:
          name = 'weatherType.sunny'
      }
      return t(name)
    }
    watch(
      () => context.attrs.weatherInfo,
      () => {
        let infoList = JSON.parse(JSON.stringify(context.attrs.weatherInfo))
        nowDateList.value = infoList.shift()
        lists.value = infoList
      },
      {
        deep: true, // 深度监听的参数
      }
    )
    watch(
            () => locale.value,
            () => {
              getStatus(nowDateList.weatherState)
            }
    )
    axios
    // .get('/aiot/alarmlist')
    // .then((res) => {
    //   console.log('res: ', res)
    // })
    // .catch((err) => {
    //   console.log('err: ', err)
    // })
    return {
      lists,
      getImg,
      nowDateList,
      getStatus,
      t
    }
  },
})
</script>
<style lang="less" scoped>
.container-border {
  width: 616px;
  margin-right: 15px;
  .weather-list {
    display: flex;
    height: 146px;
    .today-weather {
      padding: 30px 30px;
      width: 160px;
      display: flex;
      border-right: 1px solid #091b33;
      .today-text {
        margin-left: 15px;
        .font {
          line-height: 28px;
          font-size: 17px;
          .current_t {
            font-size: 35px;
          }
        }
      }
    }
    .weather {
      width: 131px;
      text-align: center;
      border-left: 1px solid #091b33;
      .font {
        line-height: 28px;
        .img {
          width: 40px;
        }
      }
    }
  }
}
.weather-img-1 {
  width: 82px;
}
</style>
