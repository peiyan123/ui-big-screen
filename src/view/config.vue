<template>
  <div class="config-set-contain">
    <el-button-group>
      <el-button @click="changeType('area')"
                 type="primary">区域设置</el-button>
      <el-button @click="changeType('access')"
                 type="primary">
        通道设置
      </el-button>
    </el-button-group>
    <div class="config-title">
      <strong v-if="configSet.type === 'area'">区域设置</strong>
      <strong v-if="configSet.type === 'access'">通道设置</strong>
    </div>
    <el-form :inline="true"
             :model="configSet"
             class="demo-form-inline">
      <el-form-item label="设备ID">
        <el-input v-model="configSet.vidiconConfig"
                  placeholder="设备ID" />
      </el-form-item>
      <el-form-item v-if="configSet.type === 'area'"
                    label="区域选择">
        <el-select v-model="configSet.name"
                   placeholder="区域选择">
          <el-option label="区域一"
                     value="location1" />
          <el-option label="区域二"
                     value="location2" />
          <el-option label="区域三"
                     value="location3" />
          <el-option label="区域四"
                     value="location4" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="configSet.type === 'access'"
                    label="通道选择">
        <el-select v-model="configSet.name"
                   placeholder="通道选择">
          <el-option label="通道一"
                     value="aes1" />
          <el-option label="通道二"
                     value="aes2" />
          <el-option label="通道三"
                     value="aes3" />
          <el-option label="通道四"
                     value="aes4" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
    <div class="table-info">
      <div class="list-title">配置列表</div>
      <el-table :data="configList"
                stripe
                style="width: 100%">
        <el-table-column prop="deviceId"
                         label="设备ID"
                         width="550" />
        <el-table-column prop="lable"
                         sortable
                         :label="configSet.type === 'access' ? '通道名称' : '区域名称'" />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { get, post } from '@/utils/axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/moudules/appStore'
export default defineComponent({
  components: {},
  setup() {
    const configSet = reactive({
      name: '',
      vidiconConfig: '',
      type: 'area',
    })
    const loginInfo = {
      username: 'jinma@qq.com',
      password: '123456',
    }
    const userStore = useUserStore()
    const configList = ref<any>([])
    function changeType(data: any) {
      configSet.name = ''
      configSet.vidiconConfig = ''
      configSet.type = data
      getDate()
    }
    function onSubmit() {
      post('/aiot/screen/setAlarmConfig', configSet).then((res: any) => {
        if (res.message === 'success') {
          ElMessage({
            message: '配置成功.',
            type: 'success',
          })
        } else {
          ElMessage.error('配置失败.')
        }
      })
    }
    function getDate() {
      let params = {
        type: configSet.type,
      }
      configList.value = []
      post('/aiot/screen/getAlarmConfig', params).then((res: any) => {
        Object.keys(res.data).forEach((item: any, index: any) => {
          configList.value.push({
            deviceId: item,
            lable: res.data[item],
          })
        })
      })
    }
    onMounted(() => {
      post('/auth/login', loginInfo).then((res: any) => {
        userStore.setToken(res.token)
        localStorage.setItem('token', res.token)
        getDate()
      })
    })
    return {
      changeType,
      configSet,
      onSubmit,
      configList,
    }
  },
})
</script>
<style lang="less" scoped>
.config-set-contain {
  width: 50%;
  margin: 0 auto;
  padding-top: 120px;
  .config-title {
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .table-info {
    margin-top: 50px;
    .list-title {
      margin-bottom: 30px;
    }
  }
}
</style>