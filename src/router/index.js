import Vue from 'vue'
import Router from 'vue-router'
import Listing from '@/components/Listing'
import sessionDetails from '@/components/sessionDetails'

Vue.use(Router)

export default new Router({
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
      path: '/session/:id',
      name: 'sessionDetails',
      component: sessionDetails
    }
  ],
  mode: 'history'
})
