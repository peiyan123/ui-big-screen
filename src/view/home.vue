<template>
  <BigScreen>
  </BigScreen>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BigScreen from './bigScreencomponents/index.vue'
export default defineComponent({
  components: {
    BigScreen,
  },
  setup() {
    // axios
    //   .get('/aiot/alarmlist')
    //   .then((res) => {
    //     console.log('res: ', res)
    //   })
  },
})
</script>