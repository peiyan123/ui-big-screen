<template>
  <div class="container-border">
    <div class="container-title">{{ $t("title.meetingRoom") }}</div>
    <div class="container_all">
      <div class="room_list">
        <div v-for="item, index in meetInfo.bigMeeting"
             :key="index"
             @click="openReport()"
             class="room_item">
          <div class="font name">{{ (item.size === 'L' ? $t("other.bigMeetingRoom") : $t("other.middleMeetingRoom")) + item.roomId + (item.roomId === '水调歌头' ? ('(12'+ $t("other.people") + ')') : (item.roomId === '清平乐' ? ('(10' + $t("other.people") + ')') : ('(8' + $t("other.people") + ')'))) }}
            <span :class="item.roomStatus ? 'used' : 'noUse'">{{ item.roomStatus ? ('（' + $t("other.occupied") + '）') : ('（' + $t("other.available") + '）') }}</span>
          </div>
          <div class="line_one">
            <div>{{ $t("other.equipment")}}</div>
            <div class="line_one_list">
              <div class="line_one_item">
                <img :src="item.air ? airConditionerImg : airConditionerCloseImg"
                     alt="">
                <div class="status">{{ item.air ? $t("other.open") : $t("other.close") }}</div>
              </div>
              <div class="line_one_item">
                <img :src="item.lamp ? lightingImg : lightingCloseImg"
                     alt="">
                <div class="status">{{ item.lamp ? $t("other.open") : $t("other.close") }}</div>
              </div>
              <div v-if="index === 0"
                   class="line_one_item">
                <img :src="item.curtain ? windowImg : windowCloseImg"
                     alt="">
                <div class="status">{{ item.curtain ? $t("other.open") : $t("other.close") }}</div>
              </div>
              <div v-if="index !== 0"
                   class="line_one_item">
                <img :src="item.hydrant ? fireImg : fireCloseImg"
                     alt="">
                <div class="status">{{ item.hydrant ? $t("other.open") : $t("other.close") }}</div>
              </div>
              <div v-if="index === 0"
                   class="line_one_item">
                <img :src="item.socket ? socketImg : socketCloseImg"
                     alt="">
                <div class="status">{{ item.socket ? $t("other.open") : $t("other.close") }}</div>
              </div>
            </div>
          </div>
          <div class="line_two">
            <div>{{ $t("other.environment")}}</div>
            <div class="line_two_list">
              <div class="line_two_item">
                <img :src="tepImg"
                     alt="">
                <div class="status">{{ item.temperature }}</div>
              </div>
              <div class="line_two_item">
                <img :src="humidityImg"
                     alt="">
                <div class="status">{{ item.humidity }}</div>
              </div>
              <div class="line_two_item">
                <img :src="pmImg"
                     alt="">
                <div class="status">{{ item.pm25 }}</div>
              </div>
              <div v-if="index === 0"
                   class="line_two_item">
                <img :src="item.hydrant ? fireImg : fireCloseImg"
                     alt="">
                <div class="status">{{ item.hydrant ? $t("other.normal") : $t("other.fault") }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="small_room">
        <div class="small_room_item"
             v-for="item, index in meetInfo.smallMeeting"
             @click="openReport()"
             :key="index">
          <div class="small_room_tirle">{{ $t("other.smallMeetingRoom") }}</div>
          <div class="small_room_id">{{ item.roomId + (item.roomId === '菩萨蛮' ? ('(6' + $t("other.people") + ')') : ('(4' + $t("other.people") + ')')) }}</div>
          <div :class="item.roomStatus ? 'red' : 'blue' ">{{ item.roomStatus ? $t("other.occupied") : $t("other.available") }}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import lightingImg from '@/assets/jinma/icon_lighting.png'
import lightingCloseImg from '@/assets/jinma/icon_lighting_close.png'
import windowImg from '@/assets/jinma/icon_window.png'
import windowCloseImg from '@/assets/jinma/icon_window_close.png'
import socketImg from '@/assets/jinma/icon_socket.png'
import socketCloseImg from '@/assets/jinma/icon_socket_close.png'
import pmImg from '@/assets/jinma/icon_pm25.png'
import fireImg from '@/assets/jinma/icon_fire.png'
import fireCloseImg from '@/assets/jinma/icon_fire_close.png'
import airConditionerImg from '@/assets/jinma/icon_air_conditioner.png'
import airConditionerCloseImg from '@/assets/jinma/icon_air_conditioner_close.png'
import tepImg from '@/assets/jinma/icon_tep.png'
import humidityImg from '@/assets/jinma/icon_humidity.png'
import { useUserStore } from '@/store/moudules/appStore'
import {useI18n} from "vue-i18n";
export default defineComponent({
  components: {},
  setup(props, context: any) {
    const { t } = useI18n();
    const meetInfo = reactive<any>({
      bigMeeting: [],
      smallMeeting: [],
    })
    const userStore = useUserStore()
    onMounted(() => {
      setTimeout(() => {}, 200)
    })
    function openReport() {
      let url
      if (window.location.hostname === 'ib.thundercomm.com') {
        url = '/jma/#/datareport/report'
      } else {
        url = '/#/datareport/report'
      }
      window.open(
        `${url}?token=${localStorage.getItem('token')}&type=meet`,
        '_brank'
      )
    }
    watch(
      () => context.attrs.meetingInfo,
      () => {
        let meetingInfo = context.attrs.meetingInfo
        // 初始化数据的时候   （http请求获取的）
        if (
          meetingInfo.maxRoomList &&
          meetingInfo.midRoomList &&
          meetingInfo.minRoomList
        ) {
          meetInfo.bigMeeting = meetingInfo.maxRoomList
          meetInfo.bigMeeting = meetInfo.bigMeeting.concat(
            meetingInfo.midRoomList
          )
          let minList = meetingInfo.minRoomList
          meetInfo.smallMeeting = minList
        } else if (meetingInfo.maxRoomList || meetingInfo.midRoomList) {
          if (meetInfo.bigMeeting.length === 0) {
            return
          }
          // 大会议室和中型会议室一起处理  （增量数据  ws接口获取）
          let roomInfo = meetingInfo.maxRoomList
            ? meetingInfo.maxRoomList
            : meetingInfo.midRoomList
          // meetInfo.bigMeeting.forEach((item: any, index: any) => {
          //   if (item.roomId === roomInfo[0].roomId) {
          //     Object.keys(roomInfo[0]).forEach((itemNew) => {
          //       if (typeof roomInfo[0][itemNew] === 'object') {
          //         let changeLable = Object.keys(roomInfo[0][itemNew])[0]
          //         item[changeLable] = roomInfo[0][itemNew][changeLable]
          //       } else {
          //         item[itemNew] = roomInfo[0][itemNew]
          //       }
          //     })
          //   }
          // })
          let changeRoomInfo = meetInfo.bigMeeting.find(
            (x: any) => x.roomId === roomInfo[0].roomId
          )
          Object.keys(roomInfo[0]).forEach((itemNew) => {
            if (typeof roomInfo[0][itemNew] === 'object') {
              let changeLable = Object.keys(roomInfo[0][itemNew])[0]
              changeRoomInfo[changeLable] = roomInfo[0][itemNew][changeLable]
            } else {
              changeRoomInfo[itemNew] = roomInfo[0][itemNew]
            }
          })
        } else {
          // 小会议室    （增量数据  ws接口获取）
          meetInfo.smallMeeting.forEach((item: any) => {
            if (item.roomId === meetingInfo.minRoomList[0].roomId) {
              item.roomStatus = meetingInfo.minRoomList[0].roomStatus
            }
          })
        }
      },
      {
        deep: true,
      }
    )
    return {
      meetInfo,
      lightingImg,
      lightingCloseImg,
      windowImg,
      windowCloseImg,
      socketImg,
      socketCloseImg,
      pmImg,
      fireImg,
      fireCloseImg,
      airConditionerImg,
      airConditionerCloseImg,
      tepImg,
      humidityImg,
      openReport,
      t
    }
  },
})
</script>
<style lang="less" scoped>
.container-border {
  width: 1466px;
  margin-right: 15px;
  .container_all {
    display: flex;
    .room_list {
      display: flex;
      margin-left: 10px;
      justify-content: flex-start;
      .room_item:first-child {
        width: 282px !important;
      }
      .room_item {
        cursor: pointer;
        background: #0a182d;
        width: 232px;
        height: 260px;
        margin-right: 13px;
        .name {
          padding: 13px 0 13px 13px;
          white-space: nowrap;
          border-bottom: 1px solid rgba(37, 162, 233, 0.1);
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          .used {
            color: rgba(242, 74, 83, 1);
          }
          .noUse {
            color: rgba(11, 218, 162, 1);
          }
        }
        .line_one {
          color: #ffffff;
          margin: 10px;
          font-size: 13px;
          .line_one_list {
            display: flex;
            margin-top: 10px;
            justify-content: space-between;
            .line_one_item {
              justify-content: start;
              background: rgba(11, 31, 55, 1);
              margin-right: 5px;
              width: 62px;
              height: 55px;
              border-radius: 5px;
              text-align: center;
              padding-top: 10px;
              img {
                width: 27px;
                height: 24px;
                margin-bottom: 5px;
              }
              .status {
                font-size: 11px;
              }
            }
          }
        }
        .line_two {
          color: #ffffff;
          margin: 10px;
          font-size: 13px;
          .line_two_list {
            display: flex;
            margin-top: 10px;
            justify-content: space-between;
            .line_two_item {
              justify-content: start;
              background: rgba(11, 31, 55, 1);
              margin-right: 5px;
              width: 62px;
              height: 55px;
              border-radius: 5px;
              text-align: center;
              padding-top: 10px;
              img {
                width: 27px;
                height: 24px;
                margin-bottom: 5px;
              }
              .status {
                font-size: 11px;
              }
            }
          }
        }
      }
    }
    .small_room {
      display: flex;
      width: 426px;
      flex-wrap: wrap;
      .small_room_item:first-child {
        width: 265px !important;
      }
      .small_room_item {
        cursor: pointer;
        width: 125px;
        height: 125px;
        margin-bottom: 10px;
        color: #ffffff;
        background: rgba(10, 24, 45, 1);
        text-align: center;
        font-size: 15px;
        line-height: 30px;
        margin-right: 15px;
        .small_room_tirle {
          margin-top: 20px;
        }
        .red {
          color: rgba(242, 74, 83, 1);
        }
        .blue {
          color: rgba(11, 218, 162, 1);
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  body {
    width: 100%;
    height: 100%;
    margin: 0;
  }
  .container-border {
    width: auto;
    margin-right: 0px;
    border: 0px;
    .container_all {
      display: block;
      .room_list {
        display: block;
        margin: 11px;
        .room_item:first-child {
          width: auto !important;
        }
        .room_item {
          width: auto !important;
          margin: 0 auto;
        }
      }
      .small_room {
        width: auto;
        justify-content: center;
        .small_room_item:first-child {
          width: 125px !important;
        }
      }
    }
  }
}
</style>
