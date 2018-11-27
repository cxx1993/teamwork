import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'timeline',
      component: () => import('./views/timeline/index.vue'),
    },
    {
      path: '/',
      name: 'about',
      component: () => import('./views/About.vue'),
    },
    {
      path: '/calender',
      name: 'calender',
      component: () => import('./views/Calender.vue'),
    },
    { path: '/*', redirect: '/' },
  ],
});
