<template>
  <div class="contant">
    <div class="header"></div>
    <div class="title">{{ $t(text) }}</div>
  </div>
</template>

<script lang="ts">
  import {defineComponent, onMounted, ref, watch} from 'vue'
import {useI18n} from "vue-i18n";
export default defineComponent({
  setup(props, context: any) {
    const text = ref<any>('')
    const { t, locale } = useI18n();
    onMounted(() => {
      text.value = context.attrs.text
    })

    return {
      text,
      t
    }
  },
})
</script>
<style lang="less" scoped>
.contant {
  display: flex;
  margin-bottom: 20px;
  .header {
    margin-right: 10px;
    width: 4px;
    height: 17px;
    background: #3981a5;
    margin-top: 4px;
  }
  .title {
    color: #ffffff;
    font-size: 17px;
    font-weight: 500;

  }
}
.ai_break_title {
  /deep/.title {
    white-space: nowrap;
    width: 110px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
