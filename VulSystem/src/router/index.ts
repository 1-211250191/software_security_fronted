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
      path: '/projects/info/:projectId',
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
      path: '/optimize',
      name: '应用优化',
      component: () => import('../views/OptimizeView.vue'),
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

router.beforeEach((to, from, next) => {
  if(to.name !== 'login' && to.name !== 'register' && !localStorage.getItem('companyId')) {
    next({ name: 'login' })
  }else{
    next()
  }
})

export default router
