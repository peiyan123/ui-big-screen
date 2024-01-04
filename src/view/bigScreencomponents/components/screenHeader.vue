<template>
  <div class="header-flex">
    <div class="img-div">
      <img class="img"
           src="@/assets/jinma/header.png"
           alt="">
    </div>

    <div class="font-time">
      <el-select class="lang-select" @change="langChange" v-model="lang" placeholder="Select">
        <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
        />
      </el-select>
      {{dataStr}}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import moment from 'moment'
import { useI18n } from "vue-i18n";
import { getCurrentInstance } from "@vue/runtime-core";

export default defineComponent({
  emit: ['resetToken'],
  setup(props, context: any) {
    let timer: any = null
    const dataStr = ref('')
    const { locale } = useI18n();
    const lang = ref('')
    let { ctx } = getCurrentInstance();
    const options = [
      {
        value: 'zh',
        label: '中文',
      },
      {
        value: 'en',
        label: 'English',
      }
    ]
    function langChange (value: string) {
      locale.value = value;
      ctx.locale = value;
      sessionStorage.setItem('lang', value)
    };
    function getTime() {
      dataStr.value = moment().format('YYYY/MM/DD HH:mm:ss')
      if (
        dataStr.value.substr(-5).split(':')[0] === '00' &&
        dataStr.value.substr(-5).split(':')[1] === '00'
      ) {
        context.emit('resetToken')
      }
      return dataStr.value
    }

    onMounted(() => {
      timer = setInterval(getTime, 1000)
      lang.value = sessionStorage.getItem('lang') || 'zh'
    })
    onBeforeUnmount(() => {
      clearInterval(timer)
    })
    return {
      getTime,
      dataStr,
      options,
      langChange,
      lang,
      locale,
      ctx
    }
  },
})
</script>
<style lang="less" scoped>
.header-flex {
  display: flex;
  justify-content: space-between;
  .font-time {
    color: #e0f0f8;
    font-size: 18px;
  }
  .img-div {
    .img {
      width: 163px;
    }
  }
}
  .lang-select {
    /deep/.select-trigger{
      .el-input {
        .el-input__inner {
          background-color: #091123;
          border: none;
          color: #fff;
          width: 95px;
        }
      }
    }
  }

</style>
