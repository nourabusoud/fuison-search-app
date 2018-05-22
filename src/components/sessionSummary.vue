<template>
  <section class="item">
    <h2 class="item-title">{{ session.title }}</h2>
    <router-link :to="{ name: 'sessionDetails', params: { id: session.id }}" v-if="!session.summary">Read more</router-link>
    <span class="item-location">{{ session.location }}</span><span class="item-year">{{ session.year }}</span>
    <span class="item-organization">{{ session.organization }}</span>
    <span class="item-speaker">{{ session.speaker }}</span>
    <div class="details" v-if="session.summary">
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
      console.log(this.session)
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
