<template>
  <div class="register">
    <div class="card">
      <h2>库灵之眼系统</h2>
      <el-input v-model="username" placeholder="请输入用户名" clearable />
      <el-input v-model="passwd" show-password placeholder="请输入密码" clearable />
      <el-button type="primary" @onclick="handleRegister">注册</el-button>
      <!-- <div class="other" @click="handleRegister">还没有账户，前去注册</div> -->
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
  const info = {
    username: username.value,
    password: passwd.value,
  }
  api.register(info)
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
.register {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 中间偏右 */
.card {
  min-width: 450px;
  width: 36%;
  transform: translateX(50%);
  padding: 10px 20px;

  h2 {
    margin-bottom: 15px;
  }

  .el-input {
    width: 70%;
    height: 45px;
    margin: 8px 0;
  }

  .el-button {
    margin: 5px 0;
    width: 70%;
    display: block;
  }

  .other {
    font-size: 12px;
    color: #336fff;
    cursor: pointer;
  }
}
</style>
