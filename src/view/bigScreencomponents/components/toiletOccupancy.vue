<template>
  <div class="container-border">
    <div class="container-title">{{ $t("title.toiletOccupancy") }}</div>
    <div class="top_list"
         @click="openReport()">
      <div class="top_list_title">{{ $t("other.northToiletStall") }}</div>
      <div class="top_boy_list">
        <div style="width: 70px" class="top_boy_item font">{{ $t("other.man") }}</div>
        <div v-for="item, index in dataList.top.boy"
             :key="index"
             class="top_boy_item">
          <!-- <img :src="item.seatStatus ? (item.seatStatus === 2 ? outlineBoy : busyBoy)  : freeBoy"
               alt=""> -->
          <span class="iconfont icon-man"
                :class="item.seatStatus ? (item.seatStatus === 2 ? 'outlineIcon' : 'busyIcon')  : 'freeIcon'"></span>
        </div>
      </div>
      <div class="top_girl_list">
        <div style="width: 70px" class="top_girl_item font">{{ $t("other.woman") }}</div>
        <div v-for="item, index in dataList.top.girl"
             :key="index"
             class="top_girl_item">
          <!-- <img :src="item.seatStatus ? (item.seatStatus === 2 ? outlineGirl : busyGirl) : freeGirl"
               alt=""> -->

          <span class="iconfont icon-woman"
                :class="item.seatStatus ? (item.seatStatus === 2 ? 'outlineIcon' : 'busyIcon')  : 'freeIcon'"></span>
        </div>
      </div>
    </div>
    <div class="bottom_list">
      <div class="bottom_list_title">{{ $t("other.southToilet") }}</div>
      <div class="bottom_boy_list">
        <div style="width: 70px" class="bottom_boy_item font">{{ $t("other.man") }}</div>
        <div v-for="item, index in dataList.bottom.boy"
             :key="index"
             class="bottom_boy_item">
          <!-- <img :src="item.seatStatus ? (item.seatStatus === 2 ? outlineBoy : busyBoy) : freeBoy"
               alt=""> -->
          <span class="iconfont icon-man"
                :class="item.seatStatus ? (item.seatStatus === 2 ? 'outlineIcon' : 'busyIcon')  : 'freeIcon'"></span>
        </div>
      </div>
      <div class="bottom_girl_list">
        <div style="width: 70px" class="bottom_girl_item font">{{ $t("other.woman") }}</div>
        <div v-for="item, index in dataList.bottom.girl"
             :key="index"
             class="bottom_girl_item">
          <!-- <img :src="item.seatStatus ? (item.seatStatus === 2 ? outlineGirl : busyGirl) : freeGirl"
               alt=""> -->
          <span class="iconfont icon-woman"
                :class="item.seatStatus ? (item.seatStatus === 2 ? 'outlineIcon' : 'busyIcon')  : 'freeIcon'"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, watch } from 'vue'
import freeBoy from '@/assets/jinma/icon_boy_free.png'
import freeGirl from '@/assets/jinma/icon_girl_free.png'
import busyBoy from '@/assets/jinma/icon_boy_busy.png'
import busyGirl from '@/assets/jinma/icon_girl_busy.png'
import outlineBoy from '@/assets/jinma/icon_boy_outline.png'
import outlineGirl from '@/assets/jinma/icon_gilr_outline.png'
import {useI18n} from "vue-i18n";
export default defineComponent({
  components: {},
  setup(props, context: any) {
    const { t } = useI18n();
    const dataList = reactive<any>({
      top: {},
      bottom: {},
    })
    onMounted(() => {
      dataList.top = {
        boy: [],
        girl: [],
      }
      dataList.bottom = {
        boy: [],
        girl: [],
      }
    })
    function openReport() {
      let url
      if (window.location.hostname === 'ib.thundercomm.com') {
        url = '/jma/#/datareport/report'
      } else {
        url = '/#/datareport/report'
      }
      window.open(
        `${url}?token=${localStorage.getItem('token')}&type=toilet`,
        '_brank'
      )
    }
    watch(
      () => context.attrs.occupancyInfo,
      () => {
        let occupancyInfo = context.attrs.occupancyInfo
        dataList.top.boy = occupancyInfo.northSeatData.mailList
        dataList.top.girl = occupancyInfo.northSeatData.femaleList
        dataList.bottom.boy = occupancyInfo.southSeatData.mailList
        dataList.bottom.girl = occupancyInfo.southSeatData.femaleList
      }
    )
    return {
      freeBoy,
      freeGirl,
      busyBoy,
      busyGirl,
      dataList,
      outlineBoy,
      outlineGirl,
      openReport,
      t
    }
  },
})
</script>
<style lang="less" scoped>
.container-border {
  width: 374px;
  .top_list {
    height: 125px;
    margin: 0 15px;
    border-bottom: 1px solid #091b33;
    padding-top: 5px;
    .top_list_title {
      font-size: 18px;
      font-weight: 500;
      color: #ffffff;
    }
    .top_boy_list {
      display: flex;
      justify-content: flex-start;
      margin-top: 15px;
      .top_boy_item {
        width: 30px;
        .icon-man {
          font-size: 26px;
          margin-left: -10px;
        }
      }
    }
    .top_girl_list {
      display: flex;
      justify-content: flex-start;
      margin-top: 15px;
      .top_girl_item {
        width: 30px;
        .icon-woman {
          font-size: 26px;
          margin-left: -10px;
        }
      }
    }
  }
  .bottom_list {
    height: 125px;
    margin: 0 15px;
    padding-top: 10px;
    .bottom_list_title {
      font-size: 18px;
      font-weight: 500;
      color: #ffffff;
    }
    .bottom_boy_list {
      display: flex;
    }
    .bottom_boy_list {
      display: flex;
      justify-content: flex-start;
      margin-top: 15px;
      .bottom_boy_item {
        width: 30px;
        .icon-man {
          font-size: 26px;
          margin-left: -10px;
        }
      }
    }
    .bottom_girl_list {
      display: flex;
      justify-content: flex-start;
      margin-top: 15px;
      .bottom_girl_item {
        width: 30px;
        .icon-woman {
          font-size: 26px;
          margin-left: -10px;
        }
      }
    }
  }
}
.outlineIcon {
  color: #a5b1bb;
}
.busyIcon {
  color: #f24a53;
}
.freeIcon {
  color: #36e09e;
}
</style>
