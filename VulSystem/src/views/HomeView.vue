<template>
  <el-container class="home_container" :class="{ login: isLoginPage }">
    <el-header class="header" v-if="!isLoginPage">
      <h2>库灵之眼</h2>
      <div class="user-entry">
        <el-icon size="24">
          <User />
        </el-icon>
        <div v-if="true" class="user-name" @click="handleLogin">登录/注册</div>
        <div v-else class="user-name">用户XXX</div>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width='200px' v-if="!isLoginPage" style="padding: 20px 0;position: fixed;">
        <el-menu router="true" :default-active="defaultIndex">
          <el-sub-menu index="/projects">
            <template #title>
              <el-icon>
                <DocumentCopy />
              </el-icon>
              <span class="menu-title">项目管理</span>
            </template>
            <el-menu-item style="margin-left: 16px;" v-for="sub in titles[0].subTitle" :key="sub.index"
              :index="'/projects' + sub.path">
              {{
                sub.uname
              }}</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/reports" class="menu-title">
            <el-icon>
              <DataLine />
            </el-icon>
            <template #title>漏洞报告</template>
          </el-menu-item>
          <!-- <el-menu-item index="/users" class="menu-title">
            <el-icon>
              <Discount />
            </el-icon>
            <template #title>用户中心</template>
          </el-menu-item> -->
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体区域 -->
      <el-main :class="{ 'home-main': !isLoginPage }">
        <!-- 路由占位符 -->
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import router from '@/router'
import {
  DocumentCopy,
  DataLine, Discount,
  User,
} from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute();

const defaultIndex = computed(() => {
  const fullPath = route.path; // 获取当前路径
  const segments = fullPath.split('/').filter(Boolean); // 去掉空的部分

  // 如果路径超过两级，只保留前两级
  if (segments.length > 2) {
    console.log(segments);
    return `/${segments[0]}/${segments[1]}`; // 注意数组是从0开始的
  }
  return fullPath; // 如果未超过，不做处理
})
// 判断当前路由是否为登录页面
const isLoginPage = computed(() => {
  return route.path === '/login' || route.path === '/register';
});
const handleLogin = () => {
  router.push('/login')
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
        uname: '项目综合分析',
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
.home_container {
  box-sizing: border-box;
  padding-top: 64px;
  height: 100vh;
}

.home_container.login{
  padding-top: 0;
}

.header {
  position: fixed;
  top: 0;
  z-index: 5;
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

.el-main {
  /* background-color: #e9edf1; */
  background-color: #f5f7fa;
  padding: 0;
}

.menu-title {
  font-size: 16px;
  font-weight: 500;
  margin: 15px 0;
}

.el-menu-item.is-active {
  /* color: #6681FA; */
  background-color: #ecf5ff;
}

.home-main {
  padding: 25px;
  margin-left: 200px;
}
</style>
