<template>
  <section class="sessionDetails">
    <pageHeader></pageHeader>
    <div class="content-wrapper">
      <h1 class="item-title">{{ sessionData.title }}</h1>
      <div class="tags-wrapper">
        <span class="tag tag-location">{{ sessionData.location }}</span><span class="tag tag-year">{{ sessionData.year }}</span>
        <span class="tag tag-speaker">{{ sessionData.speaker }}</span>
      </div>
      <div class="details" v-bind:class="{ hasVideo: youtubeLink }">
        <div class="summary">
          <p>{{ sessionData.summary }}</p>
          <a v-bind:href="sessionData.slideshare_url" v-if="sessionData.slideshare_url">Check slideshare presentation</a>
        </div>
        <div v-if="youtubeLink" class="youtube-wrappers">
          <iframe width="420" height="315"  v-bind:src="youtubeLink" frameborder="0" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {username, password} from '../fusion/credentials'
import pageHeader from './pageHeader'

export default {
  name: 'sessionDetails',
  data () {
    return {
      sessionData: {}
    }
  },
  components: {
    pageHeader
  },
  computed: {
    youtubeLink () {
      if (this.sessionData.youtube_url !== '' && typeof this.sessionData.youtube_url !== 'undefined') {
        let link = this.sessionData.youtube_url.split('https://youtu.be/')
        return `https://www.youtube.com/embed/${link[1]}`
      } else {
        return false
      }
    }
  },
  mounted () {
    this.createSession()
    this.getData()
  },
  methods: {
    createSession: function () {
      const authUrl = 'http://localhost:8764/api/session?realmName=native'
      const data = { username, password, crossDomain: true }
      this.$http.post(authUrl, data).then(function (response) {
        this.sessionCreated = true
      }, function (error) {
        console.log(error)
      })
    },
    getData: function () {
      const id = parseInt(this.$route.params.id)
      let url = `http://localhost:8764/api/apollo/apps/Revolution_Session_Data/query-pipelines/Revolution_Session_Data/collections/Revolution_Session_Data/select?q=sessionId_i:${id}`

      this.$http.get(url).then(function (response) {
        let session = {}

        let doc = response.body.response.docs[0]
        session.details = true
        session.title = doc.title_t[0]
        session.year = doc.year_s
        session.location = doc.location_s
        session.speaker = doc.speaker_name_s
        session.summary = (typeof doc.summary_t !== 'undefined') ? doc.summary_t[0] : ''
        session.organization = doc.organization_s
        session.youtube_url = (typeof doc.youtube_url_s !== 'undefined') ? doc.youtube_url_s : ''
        session.slideshare_url = (typeof doc.slideshare_url_t !== 'undefined') ? doc.slideshare_url_t[0] : ''
        this.sessionData = session
      }, function (error) {
        console.log(error)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
