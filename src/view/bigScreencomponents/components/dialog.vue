<template>
  <div class="dialog_1">
    <el-dialog v-model="$attrs.dialogVisible"
               title="告警详情"
               destroy-on-close
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               width="800px"
               :before-close="handleClose">
      <div class='body'>
        <div v-if="$attrs.detailsInfo.videoUrl"
             class="vadio">
          <video width="450"
                 height="315"
                 autoplay="autoplay"
                 loop="loop">
            <source :src="$attrs.detailsInfo.videoUrl"
                    type="video/mp4">
            <!-- <source src="movie.ogg" type="video/ogg">
                        您的浏览器不支持 video 标签。 -->
          </video>
        </div>
        <div v-else
             class="vadio"
             :style="{backgroundImage:'url(' + ($attrs.detailsInfo.pictureUrl ? $attrs.detailsInfo.pictureUrl : nopicImg) + ')'}">
          <!-- <img :src="$attrs.detailsInfo.pictureUrl ? $attrs.detailsInfo.pictureUrl : nopicImg"
               alt=""> -->
        </div>
        <div class="info">
          <div class="info_data">
            <span class="label">事件内容:</span>
            <span class="message">{{getAlertName()}}</span>
          </div>
          <div class="info_data">
            <span class="label">告警级别:</span>
            <span class="message">{{getAlarmLevel()}}</span>
          </div>
          <div class="info_data">
            <span class="label">告警类型:</span>
            <span class="message">{{getAlarmType()}}</span>
          </div>
          <div class="info_data">
            <span class="label">告警序号:</span>
            <span class="message">{{$attrs.detailsInfo.id.id}}</span>
          </div>
          <div class="info_data">
            <span class="label">告警时间:</span>
            <span class="message">{{timestampToTime2($attrs.detailsInfo.createdTime)}}</span>
          </div>
          <div class="info_data">
            <span class="label">告警设备:</span>
            <span class="message">{{$attrs.detailsInfo.originatorName}}</span>
          </div>
          <div class="info_data">
            <span class="label">通告名称:</span>
            <span class="message">{{$attrs.detailsInfo.details.cameraName}}</span>
          </div>
          <div class="info_data">
            <span class="label">处理状态:</span>
            <span class="message">{{getAlarmStatus()}}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="cancel"
                     @click="cancle">取消</el-button>
          <!-- <el-button class="confirm"
                     @click="submit">已处理</el-button> -->
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import nopicImg from '@/assets/jinma/nopic.png'
import moment from 'moment'
export default defineComponent({
  components: {},
  emit: ['cancle'],
  setup(props, context: any) {
    function cancle() {
      context.emit('cancle')
    }
    function handleClose() {
      context.emit('cancle')
    }
    function getAlertName() {
      switch (context.attrs.detailsInfo.type) {
        case 'maskinspectoradv':
          return '未佩戴口罩'
          break
        case 'ondutyinspectoradv':
          return '人员离岗'
          break
        case 'person':
          return '人群聚集'
          break
        case 'blockedmonitoring':
          return '占道警告'
          break
      }
    }
    function getAlarmType() {
      switch (context.attrs.detailsInfo.type) {
        case 'maskinspectoradv':
          return '口罩警告'
          break
        case 'blockedmonitoring':
          return '占道警告'
          break
        case 'person':
          return '人群聚集警告'
          break
        case 'ondutyinspectoradv':
          return '离岗警告'
          break
      }
    }
    function getAlarmLevel() {
      switch (context.attrs.detailsInfo.severity) {
        case 'CRITICAL':
          return '紧急告警'
          break
        case 'MAJOR':
          return '重要告警'
          break
        case 'MINOR':
          return '一般告警'
          break
      }
    }
    function getAlarmStatus() {
      switch (context.attrs.detailsInfo.status) {
        case 'ACTIVE_UNACK':
          return '未处理'
          break
        case 'CLEARED':
          return '已处理'
          break
      }
    }
    function timestampToTime2(timestamp: any) {
      return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
    }

    return {
      cancle,
      handleClose,
      getAlarmType,
      getAlarmLevel,
      timestampToTime2,
      getAlarmStatus,
      getAlertName,
      nopicImg,
    }
  },
})
</script>
<style lang="less">
.dialog_1 {
  .el-overlay {
    .el-overlay-dialog {
      .el-dialog {
        background: #091123;
        border: 1px solid #427891;
        height: 530px;
        .el-dialog__header {
          border-bottom: 1px solid rgba(122, 222, 255, 0.05);
          .el-dialog__title {
            font-size: 20px;
            font-weight: 500;
            color: #ffffff;
          }
        }
        .el-dialog__body {
          height: 380px !important;
          .body {
            height: 350px;
            display: flex;
            .vadio {
              width: 60%;
              height: 100%;
              display: flex;
              justify-content: center;
              background-size: 100% 100%;
              background-repeat: no-repeat;
            }
            .info {
              margin-left: 10px;
              .info_data {
                font-size: 14px;
                margin-bottom: 23px;
                .label {
                  color: #bbd3e5;
                  margin-right: 25px;
                }
                .message {
                  color: #ffffff;
                }
              }
            }
          }
        }
        .el-dialog__footer {
          border-top: 1px solid rgba(122, 222, 255, 0.05);
          .dialog-footer {
            .cancel {
              width: 106px;
              height: 40px;
              background: #091123;
              border: 1px solid #36bbd2;
              border-radius: 5px;
              font-weight: 400;
              color: #36bbd2;
              font-size: 16px;
            }
            .confirm {
              width: 106px;
              height: 40px;
              background: #36bbd2;
              border-radius: 5px;
              font-weight: 400;
              color: #ffffff;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}
</style>