import Vue from 'vue'
import Router from 'vue-router'
import Listing from '@/components/Listing'
import sessionDetails from '@/components/sessionDetails'
import notFound from '@/components/notFound'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Listing
    },
    {
      path: '/listing/:page?/:term?',
      name: 'Listing',
      component: Listing
    },
    {
      path: '/session/:id/:term?',
      name: 'sessionDetails',
      component: sessionDetails
    },
    {
      path: '/notFound',
      component: notFound
    }
  ],
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  if (!to.matched.length) {
    next('/notFound')
  } else {
    next()
  }
})

export default router
