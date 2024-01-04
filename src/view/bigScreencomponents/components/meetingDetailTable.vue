<template>
  <div class="user_skills">
    <el-table :data="$attrs.tableData"
              :header-cell-style="{background:'rgba(241, 241, 241, 0.3)'}"
              style="width: 100%">
      <el-table-column v-if="$attrs.type === '1'"
                       prop="summary"
                       :label="$t('other.meetTopic')"
                       width="250" />
      <el-table-column v-if="$attrs.type === '1'"
                       prop="createBy"
                       :label="$t('other.createUser')"
                       width="120" />
      <el-table-column prop="startTime"
                       :label="$attrs.type === '1' ? $t('other.meetStartTime') : $t('other.meetEndTime')" />
      <el-table-column prop="endTime"
                       :label="$attrs.type === '1' ? $t('other.meetEndTime') : $t('other.meetStartTime')" />
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {useI18n} from "vue-i18n";
export default defineComponent({
  setup() {
    const { t } = useI18n();
    // axios
    //   .get('/aiot/alarmlist')
    //   .then((res) => {
    //     console.log('res: ', res)
    //   })
    return {
      t
    }
  },
})
</script>
<style lang="less" scoped>
.user_skills /deep/ .el-table,
.el-table__expanded-cell {
  background-color: rgba(241, 241, 241, 0.3);
}

.user_skills /deep/ .el-table tr {
  background-color: rgba(241, 241, 241, 0.3) !important;
}
.user_skills /deep/ .el-table--enable-row-transition .el-table__body td,
.el-table .cell {
  background-color: rgba(241, 241, 241, 0.3);
}
.el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0px;
}
</style>
