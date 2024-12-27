<template>
  <div class="login">
    <div class="card">
      <h2>库灵之眼系统</h2>
      <el-input v-model="username" placeholder="请输入用户名" clearable />
      <el-input v-model="passwd" show-password placeholder="请输入密码" clearable />
      <el-button type="primary" @onclick="handleLogin">登录</el-button>
      <div class="other" @click="handleRegister">还没有账户，前去注册</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import router from '@/router'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { api } from './service'
const username = ref('')
const passwd = ref('')
const handleRegister = () => {
  router.push('/register')
}
const handleLogin = () => {
  api.login(username.value, passwd.value)
    .then(res => {
      console.log(res);
      router.push('/')
    })
    .catch(err => {
      ElMessage.error(err)
    })
}
</script>

<style scoped>
.login {
  background: url('../assets/bg.jpg');
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 中间偏右 */
.card {
  min-height: 40vh;
  background-color: #fff;
  border-radius: 5px;
  min-width: 350px;
  width: 24%;
  transform: translateX(60%);
  padding: 25px 30px;

  h2 {
    margin-bottom: 15px;
    font-weight: 600;
    font-size: 24px;
  }

  .el-input {
    /* width: 70%; */
    height: 45px;
    margin: 8px 0;
  }

  .el-button {
    margin: 25px 0 10px;
    width: 100%;
    display: block;
  }

  .other {
    font-size: 12px;
    color: #336fff;
    cursor: pointer;
  }


}
</style>
