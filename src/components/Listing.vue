<template>
  <div class="content-wrapper listing">
    <h1>{{ title }}</h1>
    <div class="serach-box">
      <input type="text" class="search-field" v-model="term" @keyup.enter="getFusionData">
      <button class="search-button" v-on:click="getFusionData">Go</button>
    </div>
    <div class="search-result">
      <sessionSummary  v-for="session in results"  :key="session.id" :session="session"></sessionSummary>
    </div>
  </div>
</template>

<script>
import {username, password} from '../fusion/credentials'
import sessionSummary from './sessionSummary'
/* eslint-disable no-unused-expressions */
export default {
  name: 'Listing',
  data () {
    return {
      title: 'Revolution Session Data',
      term: '',
      authSessionCreated: false,
      results: []
    }
  },
  components: {
    sessionSummary
  },
  watch: {
    // term: function (val) {
    //   this.getFusionData()
    // }
  },
  mounted () {
    this.createSession()
    this.getFusionData()
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
    getFusionData: function () {
      let serachTerm = (this.term !== '') ? this.term : '*:*'

      let url = `http://localhost:8764/api/apollo/apps/Revolution_Session_Data_Search/query-pipelines/_lw_qwb_tmp_50569357302522626/collections/Revolution_Session_Data_Search/select?echoParams=all&wt=json&json.nl=arrarr&sort&start=0&q=${serachTerm}&debug=true&rows=5`

      console.log(url)
      this.results = [] // reset results
      this.$http.get(url).then(function (response) {
        // console.log(response.body)
        let docs = response.body.response.docs
        docs.forEach(item => {
          let session = {}
          session.id = item.id
          session.title = item.title_s
          session.year = item.year_s
          session.location = item.location_s
          session.speaker = item.speaker_name_s
          session.summary = item.summary_t[0]
          session.organization = item.organization_s
          session.youtube_url = (typeof item.youtube_url_s !== 'undefined') ? item.youtube_url_s : ''
          session.slideshare_url = (typeof item.slideshare_url_t !== 'undefined') ? item.slideshare_url_t[0] : ''

          // session.slideshare_url_t ? session.slideshare_url = session.slideshare_url_t : session.youtube_url = ''
          this.results.push(session)
        })
        console.log(this.results)
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
