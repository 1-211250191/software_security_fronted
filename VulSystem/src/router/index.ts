import { createRouter, createWebHistory } from 'vue-router'
import ProjectsDetail from '@/views/ProjectsDetail.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/projects/info',
    },
    {
      path: '/projects/info',
      name: '项目管理',
      component: () => import('../views/ProjectsInfo.vue'),
    },
    {
      path: '/projects/info/:project',
      name: '项目分析',
      component: ProjectsDetail,
      props: true,
    },
    {
      path: '/projects/analy',
      name: '项目综合分析',
      component: () => import('../views/ProjectsAnaly.vue'),
    },
    {
      path: '/reports',
      name: '漏洞报告',
      component: () => import('../views/ReportsView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RegisterView.vue'),
    },
  ],
})

export default router
