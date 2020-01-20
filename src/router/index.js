import Vue from 'vue'
import Router from 'vue-router'
import DrawPage from '@/components/drawPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'drawPage',
      component: DrawPage
    }
  ]
})
