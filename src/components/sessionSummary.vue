<template>
  <section class="item">
    <h3 class="item-title">{{ session.title }}</h3>
    <p class="short-summary">{{ session.summary }}</p>
    <router-link :to="{ name: 'sessionDetails', params: { id: session.id }}">Read more</router-link>
    <div class="tags-wrapper">
      <span class="tag tag-location">{{ session.location }}</span><span class="tag tag-year">{{ session.year }}</span>
      <span class="tag tag-speaker">{{ session.speaker }}</span>
    </div>
  </section>
</template>

<script>
export default {
  name: 'sessionSummary',
  props: ['session'],
  data () {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
