import Vue from 'vue'
import { createLocalVue, mount } from '@vue/test-utils'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Listing from '@/components/Listing.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(VueResource)
const routes = [
  {
    path: '/',
    name: 'home',
    component: Listing
  },
  {
    path: '/listing/:page?/:term?',
    name: 'Listing',
    component: Listing
  }
]
const router = new VueRouter({
 routes
})

describe('Listing', () => {
  // Now mount the component and you have the wrapper
  const wrapper = mount(Listing, { localVue, router })
  const vm = wrapper.vm

  it('should render correct markup', () => {
    expect(wrapper.html()).toContain('<div class="logo">Revolution data</div>')
  })

  it('should get new fusion data', () => {
    wrapper.find('input').element.value = 'solr';
    wrapper.find('.search-button').trigger('click')
    expect(wrapper.html()).toContain('<h2>Sorry, there are no results for: *:*</h2>')
  })
})