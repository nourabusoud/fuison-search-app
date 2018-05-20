<template>
  <section>
    <h2 class="item-title">{{ session.title }}</h2>
    <span class="item-location">{{ session.location }}</span><span class="item-year">{{ session.year }}</span>
    <span class="item-organization">{{ session.organization }}</span>
    <span class="item-speaker">{{ session.speaker }}</span>
    <div class="details">
      <p>{{ session.summary }}</p>
    </div>
  </section>
</template>
<script>

export default {
  name: 'sessionSummary',
  props: ['session'],
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
