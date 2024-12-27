<template>
  <header class="header" v-if="!isLoginPage">
    <h2>库灵之眼</h2>
    <div class="user-entry">
      <el-icon size="24">
        <User />
      </el-icon>
      <div v-if="true" class="user-name" @click="handleLogin">登录/注册</div>
      <div v-else class="user-name">用户XXX</div>
    </div>
  </header>
  <el-row class="tac" v-if="!isLoginPage">
    <el-col :span="12">
      <el-menu default-active="0" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
        :popper-offset="8">
        <div v-for="title in titles" :key="title.index">
          <el-sub-menu v-if="title.subTitle && title.subTitle.length > 0" :index="title.index">
            <template #title>
              <el-icon>
                <location />
              </el-icon>
              <span>{{ title.uname }}</span>
            </template>
            <el-menu-item v-for="sub in title.subTitle" :key="sub.index" :index="sub.index"
              @click="onChangePath(title.path + sub.path)">{{ sub.uname
              }}</el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="title.index" @click="onChangePath(title.path)">
            <template #title>
              <el-icon>
                <location />
              </el-icon>
              <span>{{ title.uname }}</span>
            </template>
          </el-menu-item>
        </div>
      </el-menu>
    </el-col>
  </el-row>
  <RouterView />
</template>

<script lang="ts" setup>
import router from '@/router'
import {
  Menu,
  Location,
  User,
} from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const route = useRoute();

// 判断当前路由是否为登录页面
const isLoginPage = computed(() => {
  return route.path === '/login' || route.path === '/register';
});
const handleLogin = () => {
  router.push('/login')
}
const onChangePath = (path: string) => {
  console.log(path)
  router.push(path)
}
interface NavTitle {
  index: string,
  uname: string,
  path: string,
  subTitle?: NavTitle[],
}
const titles: NavTitle[] = [
  {
    index: '0',
    uname: '项目管理',
    path: '/projects',
    subTitle: [
      {
        index: '0-0',
        uname: '项目信息',
        path: '/info',
      },
      {
        index: '0-1',
        uname: '项目漏洞分析',
        path: '/analy',
      },
    ]
  }, {
    index: '1',
    uname: '漏洞报告',
    path: '/reports',
  }, {
    index: '2',
    uname: '用户中心',
    path: '/users',
  },
]
</script>
<style scoped>
.header {
  background-color: #336fff;
  height: 64px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;

  h2 {
    color: #fff;
    font-weight: 600;
  }

  .user-entry {
    display: flex;
    color: #fff;
    padding-right: 20px;

    .user-name {
      margin-left: 15px;
      cursor: pointer;
    }
  }
}
</style>
