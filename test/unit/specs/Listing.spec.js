import Vue from 'vue'
import Router from 'vue-router'
import Listing from '@/components/Listing'

describe('Listing.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Listing)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.listing h1').textContent)
      .toEqual('Revolution Session Data')
  })
})
