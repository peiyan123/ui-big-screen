<template>
  <div class="bg-img">
    <div class="login-header">
      <img src="/src/assets/jinma/header.png"
           alt="">
    </div>
    <div class="login-form">
      <el-form label-position="top"
               :rules="rules"
               :model="formLabelAlign">
        <el-form-item class="form-lable"
                      prop="username"
                      label="用户名（电子邮件）">
          <el-input v-model="formLabelAlign.username" />
        </el-form-item>
        <el-form-item class="form-lable"
                      prop="password"
                      label="密码">
          <el-input type="password"
                    v-model="formLabelAlign.password" />
        </el-form-item>
        <el-form-item>
          <el-button class="submit-btn"
                     type="primary"
                     v-loading="loadingStatue"
                     @click="submitForm(formLabelAlign)">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="login-footer"></div>
  </div>
</template>

<script lang="ts">
import { useUserStore } from '@/store/moudules/appStore'
import { post } from '@/utils/axios'
import { defineComponent, onMounted, reactive, ref } from 'vue'
import BigScreen from './bigScreencomponents/index.vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
export default defineComponent({
  components: {
    BigScreen,
  },
  setup() {
    const formLabelAlign = reactive({
      username: '',
      password: '',
    })
    const userStore = useUserStore()
    const router = useRouter()
    const loadingStatue = ref(false)
    const rules = reactive({
      username: [
        {
          required: true,
          message: '用户名不为空',
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: true,
          message: '密码不为空',
          trigger: 'blur',
        },
      ],
    })
    function submitForm() {
      loadingStatue.value = true
      post('/auth/login', formLabelAlign).then(
        (res: any) => {
          userStore.setToken(res.token)
          loadingStatue.value = false
          localStorage.setItem('token', res.token)
          router.push('/')
        },
        (err) => {
          ElMessage.error(err)
          loadingStatue.value = false
        }
      )
    }

    return {
      formLabelAlign,
      rules,
      submitForm,
      loadingStatue,
    }
  },
})
</script>
<style lang="less" scoped>
.submit-btn {
  width: 550px;
  margin-top: 50px;
  height: 50px;
}
.bg-img {
  background: url('../assets/jinma/login_bg.png') 50% no-repeat;
  width: 100%;
  height: 100%;
  .login-header {
    position: absolute;
    left: 30px;
    top: 20px;
    img {
      width: 250px;
    }
  }
  .login-form {
    width: 550px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -275px;
    margin-top: -75px;
    z-index: 100;
    /deep/.el-form {
      .form-lable {
        label {
          color: #fff;
        }
        .el-form-item__content {
          .el-input {
            input {
              background-color: rgba(255, 255, 255, 0);
              color: #fff;
              border-left: 0px;
              border-right: 0px;
              border-top: 0px;
            }
          }
        }
      }
    }
  }
  .login-footer {
    width: 100%;
    position: fixed;
    bottom: 0px;
    height: 290px;
    background: url('../assets/jinma/login_footer.png');
    background-size: cover;
  }
}
</style>