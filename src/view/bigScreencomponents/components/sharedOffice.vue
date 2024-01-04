<template>
  <div class="container-border">
    <div class="container-title">{{ $t("title.shareOffice") }}</div>
    <div class="pie-div">
      <DefaultPieCharts :height="150"
                        :width="140"
                        :info="info_1"
                        :id="'pie-1'"></DefaultPieCharts>
      <DefaultPieCharts :height="150"
                        :width="140"
                        :info="info_2"
                        :id="'pie-2'"></DefaultPieCharts>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, watch } from 'vue'
// import axios from '../utils/axios'
import DefaultPieCharts from '@/components/defaultPieCharts.vue'
import {useI18n} from "vue-i18n";
export default defineComponent({
  components: {
    DefaultPieCharts,
  },
  setup(props, context: any) {
    const { t, locale } = useI18n();
    const info_1 = reactive({
      max: 0,
      change: false,
      current: 0,
      color: '#4DBFFF',
      title: t("other.availableSharedStations") ,
      subtext: t("other.occupy") + '/' +  t("other.station"),
    })
    const info_2 = reactive({
      max: 0,
      current: 0,
      change: false,
      color: '#FEAC68',
      title: t("other.sharedStationProportion") ,
      subtext: t("other.share") + '/' +  t("other.all")
    })
    watch(
      () => context.attrs.officeInfo,
      () => {
        info_1.max = context.attrs.officeInfo.sharedNum
        info_2.max = context.attrs.officeInfo.allNum
        info_1.current = context.attrs.officeInfo.occupiedNum
        info_2.current = context.attrs.officeInfo.sharedNum
      },
    )
    watch(
            () => locale.value,
          () => {
            info_1.title = t("other.availableSharedStations")
            info_2.title = t("other.sharedStationProportion")
            info_1.subtext = t("other.occupy") + '/' +  t("other.station")
            info_2.subtext = t("other.share") + '/' +  t("other.all")
            }
    )
    return {
      info_1,
      info_2,
      t
    }
  },
})
</script>
<style lang="less" scoped>
.container-border {
  width: 374px;
  .pie-div {
    display: flex;
    justify-content: space-around;
  }
}
@media screen and (max-width: 750px) {
  .container-border {
    width: auto;
    border: 0px;
    margin-top: 30px;
    .pie-div {
      display: block;
      #pie-1 {
        transform: scale(1.5);
        margin: 0 auto;
        margin-top: 50px;
      }
      #pie-2 {
        transform: scale(1.5);
        margin: 0 auto;
        margin-top: 85px;
      }
    }
  }
}
</style>
