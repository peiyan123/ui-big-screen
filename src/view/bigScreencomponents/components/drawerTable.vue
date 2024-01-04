<template>
  <div class="use_drawer">
    <el-drawer v-model="$attrs.drawerFlag"
               :before-close="handleClose"
               size="40%">
      <template #title>
        <h2 :id="titleId"
            :class="titleClass">{{$attrs.selectData + $attrs.drawerTitle}}</h2>
      </template>
      <el-collapse v-model="activeNames"
                   @change="handleChange">
        <el-collapse-item title="水调歌头"
                          name="0">
          <MeetingDetailTable :type="type"
                              :tableData="list1"></MeetingDetailTable>
        </el-collapse-item>
        <el-collapse-item title="清平乐"
                          name="1">
          <MeetingDetailTable :type="type"
                              :tableData="list2"></MeetingDetailTable>
        </el-collapse-item>
        <el-collapse-item title="风陵渡"
                          name="2">
          <MeetingDetailTable :type="type"
                              :tableData="list3"></MeetingDetailTable>
        </el-collapse-item>
        <el-collapse-item title="醉花阴"
                          name="3">
          <MeetingDetailTable :type="type"
                              :tableData="list4"></MeetingDetailTable>
        </el-collapse-item>
        <el-collapse-item title="菩萨蛮"
                          name="4">
          <MeetingDetailTable :type="type"
                              :tableData="list5"></MeetingDetailTable>
        </el-collapse-item>
        <el-collapse-item title="忆江南"
                          name="5">
          <MeetingDetailTable :type="type"
                              :tableData="list6"></MeetingDetailTable>
        </el-collapse-item>
        <el-collapse-item title="卜算子"
                          name="6">
          <MeetingDetailTable :type="type"
                              :tableData="list7"></MeetingDetailTable>
        </el-collapse-item>
        <el-collapse-item title="沁园春"
                          name="7">
          <MeetingDetailTable :type="type"
                              :tableData="list8"></MeetingDetailTable>
        </el-collapse-item>
        <el-collapse-item title="如梦令"
                          name="8">
          <MeetingDetailTable :type="type"
                              :tableData="list9"></MeetingDetailTable>
        </el-collapse-item>
      </el-collapse>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { post } from '@/utils/axios'
import moment, { Moment } from 'moment'
import MeetingDetailTable from './meetingDetailTable.vue'
import { defineComponent, onMounted, ref, watch } from 'vue'
export default defineComponent({
  components: {
    MeetingDetailTable,
  },
  emits: ['close'],
  setup(props, context) {
    const list1 = ref([])
    const list2 = ref([])
    const list3 = ref([])
    const list4 = ref([])
    const list5 = ref([])
    const list6 = ref([])
    const list7 = ref([])
    const list8 = ref([])
    const list9 = ref([])
    const type = ref('')
    const table = ref(false)
    const roomList = [
      '水调歌头',
      '清平乐',
      '风陵渡',
      '醉花阴',
      '菩萨蛮',
      '忆江南',
      '卜算子',
      '沁园春',
      '如梦令',
    ]
    function handleClose() {
      context.emit('close')
    }
    const activeNames = ref(['0'])
    const handleChange = (val: string[]) => {
      console.log(val)
    }
    onMounted(() => {
      let params
      if (context.attrs.drawerTitle === ' 会议室预约使用详情') {
        params = {
          type: 1,
          date: context.attrs.selectData,
        }
        type.value = '1'
      } else {
        params = {
          type: 2,
          date: moment(context.attrs.selectData as Moment).format('YYYY-MM-DD'),
        }
        type.value = '2'
      }
      post('/aiot/screen/meetingRoom/rooms/record', params).then((res: any) => {
        Object.keys(res.data).forEach((item: any) => {
          switch (item) {
            case '水调歌头':
              list1.value = res.data['水调歌头']
              break
            case '清平乐':
              list2.value = res.data['清平乐']
              break
            case '风陵渡':
              list3.value = res.data['风陵渡']
              break
            case '醉花阴':
              list4.value = res.data['醉花阴']
              break
            case '菩萨蛮':
              list5.value = res.data['菩萨蛮']
              break
            case '忆江南':
              list6.value = res.data['忆江南']
              break
            case '卜算子':
              list7.value = res.data['卜算子']
              break
            case '沁园春':
              list8.value = res.data['沁园春']
              break
            case '如梦令':
              list9.value = res.data['如梦令']
              break
          }
        })
      })
    })
    return {
      table,
      handleClose,
      activeNames,
      handleChange,
      roomList,
      list1,
      list2,
      list3,
      list4,
      list5,
      list6,
      list7,
      list8,
      list9,
      type,
    }
  },
})
</script>
<style lang="less" scoped>
.use_drawer {
  /deep/.el-overlay {
    .el-drawer {
      .el-drawer__body {
        .el-collapse {
          border: 0px;
          .el-collapse-item {
            .el-collapse-item__wrap {
              border: 0px;
              background-color: rgba(87, 88, 94, 0.3);
              color: #fff;
            }
            div {
              .el-collapse-item__header {
                font-size: 20px;
                font-weight: bold;
                color: #fff;
                padding-left: 10px;
                border: 0px;
                background-color: rgba(87, 88, 94, 0.3);
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
}
</style>