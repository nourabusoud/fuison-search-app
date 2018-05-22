<template>
  <div class="content-wrapper listing">
    <h1>{{ title }}</h1>
    <div class="serach-box">
      <input type="text" class="search-field" v-model="term" @keyup.enter="getFusionData">
      <button class="search-button" v-on:click="getFusionData">Go</button>
    </div>
    <div v-if="getSummary">
      <sessionSummary  :session="session"></sessionSummary>
    </div>
  </div>
</template>

<script>
import sessionSummary from './sessionSummary'

export default {
  name: 'sessionDetails',
  data () {
    return {
      term: '',
      title: 'Details Page',
      getSummary: false,
      session: {}
    }
  },
  components: {
    sessionSummary
  },
  computed: {},
  mounted () {
    this.getFusionData()
  },
  methods: {
    getFusionData: function () {
      const id = parseInt(this.$route.params.id)

      let url = `http://localhost:8764/api/apollo/apps/Revolution_Session_Data/query-pipelines/Revolution_Session_Data/collections/Revolution_Session_Data/select?q=sessionId_i:${id}`

      this.$http.get(url).then(function (response) {
        console.log('response', response)
        this.resultCount = response.body.response.numFound
        let doc = response.body.response.docs[0]
        this.getSummary = true
        this.session.title = doc.title_t[0]
        this.session.year = doc.year_s
        this.session.location = doc.location_s
        this.session.speaker = doc.speaker_name_s
        this.session.summary = (typeof doc.summary_t !== 'undefined') ? doc.summary_t[0] : ''
        this.session.organization = doc.organization_s
        this.session.youtube_url = (typeof doc.youtube_url_s !== 'undefined') ? doc.youtube_url_s : ''
        this.session.slideshare_url = (typeof doc.slideshare_url_t !== 'undefined') ? doc.slideshare_url_t[0] : ''

        console.log(this.session)
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
