<template>
  <section class="item">
    <h2 class="item-title">{{ session.title }}</h2>
    <span class="item-location">{{ session.location }}</span><span class="item-year">{{ session.year }}</span>
    <span class="item-organization">{{ session.organization }}</span>
    <span class="item-speaker">{{ session.speaker }}</span>
    <input type="checkbox" class="details-toggle">
    <div class="details">
      <p>{{ session.summary }}</p>
      <div v-if="youtubeLink">
        <iframe width="420" height="315"  v-bind:src="youtubeLink" frameborder="0" allowfullscreen></iframe>
      </div>
      <div v-if="session.slideshare_url">
        <a v-bind:href="session.slideshare_url">Go to presentation</a>
      </div>
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
  computed: {
    youtubeLink () {
      if (this.session.youtube_url !== '') {
        let link = this.session.youtube_url.split('https://youtu.be/')
        return `https://www.youtube.com/embed/${link[1]}`
      } else {
        return false
      }
    }
  },
  mounted () {},
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
