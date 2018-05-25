<template>
  <section>
    <pageHeader></pageHeader>
    <div class="error-message">
      <h2>404: Page not found</h2>
    </div>
  </section>
</template>

<script>
/* eslint-disable no-unused-expressions */
import pageHeader from './pageHeader'
export default {
  name: 'notFound',
  data () {
    return {}
  },
  components: {
    pageHeader
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
