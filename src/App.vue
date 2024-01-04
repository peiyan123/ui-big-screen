


<template>
  <router-view></router-view>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
export default defineComponent({
  setup() {
    const scale = ref(0)
    function getScale() {
      const width = 1920,
        height = 1080
      let ww = window.innerWidth / width
      let wh = window.innerHeight / height
      return ww < wh ? wh : ww
    }
    function setScale() {
      scale.value = getScale()
      // console.log(scale.value)
      let dom = document.getElementById('app')
      dom!.style.transform = `scale(${scale.value})`
    }

    function IsPC() {
      var userAgentInfo = navigator.userAgent
      var Agents = [
        'Android',
        'iPhone',
        'SymbianOS',
        'Windows Phone',
        'iPad',
        'iPod',
      ]
      var flagPc = true
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flagPc = false
          break
        }
      }
      return flagPc
    }
    onMounted(() => {
      if (IsPC()) {
        setScale()
        window.addEventListener('resize', setScale)
      }
    })
    return {
      scale,
      setScale,
      getScale,
    }
  },
})
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
