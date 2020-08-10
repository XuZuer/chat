import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '*',
    redirect: '/login'
  },
  {
    name: 'login',
    component: () => import('@/view/login'),
    meta: {
      title: '登录'
    }
  },
  {
    name: 'signin',
    component: () => import('@/view/signin'),
    meta: {
      title: '注册'
    }
  },
  {
    name: 'win',
    component: () => import('@/view/windows'),
    meta: {
      title: '聊天窗'
    }
  },
]

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
});

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export default router
