<template>
  <div class="container-border">
    <div class="container-title">{{ $t("title.officeAir") }}</div>
    <div class="item_list">
      <div class="item">
        <img class="img"
             :src="tepImg"
             alt="">
        <div class="font data">{{ Math.trunc(dataList.temperature) }} <span class="unit">℃</span> </div>
        <div class="font name">{{ $t("officeType.temp") }}</div>
      </div>
      <div class="item">
        <img class="img"
             :src="humidityImg"
             alt="">
        <div class="font data">{{ Math.trunc(dataList.humidity) }} <span class="unit">%</span> </div>
        <div class="font name">{{ $t("officeType.humidity") }}</div>
      </div>
      <div class="item">
        <img class="img"
             :src="pressureImg"
             alt="">
        <div class="font data">{{ Math.trunc(dataList.pressure/100) }} <span class="unit">hPa</span> </div>
        <div class="font name">{{ $t("officeType.pressure") }}</div>
      </div>
      <!-- <div class="item">
        <img class="img"
             :src="illuminationImg"
             alt="">
        <div class="font data">{{ dataList.illumination }} <span class="unit">%</span> </div>
        <div class="font name">照度</div>
      </div> -->
      <div class="item">
        <img class="img"
             :src="co2Img"
             alt="">
        <div class="font data">{{ (Math.trunc(dataList.co2) > 1000) ? 998 : Math.trunc(dataList.co2) }} <span class="unit">PPM</span> </div>
        <div class="font name">{{ $t("officeType.CO2Concentration") }}</div>
      </div>
      <div class="item">
        <img class="img"
             :src="vocImg"
             alt="">
        <div class="font data">{{ Math.trunc(dataList.voc) }} <span class="unit">%</span> </div>
        <div class="font name">{{ $t("officeType.VOCConcentration") }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import humidityImg from '@/assets/jinma/icon_humidity.png'
import co2Img from '@/assets/jinma/icon_CO2.png'
import illuminationImg from '@/assets/jinma/icon_illumination.png'
import pressureImg from '@/assets/jinma/icon_pressure.png'
import tepImg from '@/assets/jinma/icon_tep.png'
import vocImg from '@/assets/jinma/icon_voc.png'
import {useI18n} from "vue-i18n";
export default defineComponent({
  components: {},
  setup(props, context: any) {
    const { t } = useI18n();
    const dataList = ref<any>({})
    onMounted(() => {})
    watch(
      () => context.attrs.airQualityInfo,
      () => {
        dataList.value = context.attrs.airQualityInfo
      }
    )
    return {
      humidityImg,
      co2Img,
      illuminationImg,
      pressureImg,
      tepImg,
      vocImg,
      dataList,
      t
    }
  },
})
</script>
<style lang="less" scoped>
.container-border {
  width: 833px;
  margin-right: 15px;
  .item_list {
    display: flex;
    justify-content: space-around;
    margin-top: 15px;
    .item {
      text-align: center;
      .img {
        width: 55px;
      }
      .data {
        font-size: 22px;
      }
      .name {
        font-size: 15px;
      }
      .font {
        text-align: center;
        margin-top: 8px;
        .unit {
          font-size: 15px;
        }
      }
    }
  }
}
</style>
