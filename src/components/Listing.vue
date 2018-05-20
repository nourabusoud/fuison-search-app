<template>
  <div class="listing">
    <h1>{{ title }}</h1>
    <input type="text" name="search" v-model="term">
    <div id="search-result">
      <div v-for="session in results" :key="session.id" class="item">
        <h2>{{ session.title }} - {{ session.year }}</h2>
        <h3>{{ session.speaker }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
import {username, password} from '../fusion/credentials'

export default {
  name: 'Listing',
  data () {
    return {
      title: 'Search stuff here',
      term: '',
      sessionCreated: false,
      results: []
    }
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
      let url = 'http://localhost:8764/api/apollo/apps/Revolution_Session_Data_Search/query-pipelines/_lw_qwb_tmp_49394373810908136/collections/Revolution_Session_Data_Search/select?echoParams=all&wt=json&json.nl=arrarr&sort&start=0&q=*:*&debug=true&rows=10'

      this.$http.get(url).then(function (response) {
        // console.log(response.body)
        /* eslint-disable no-unused-expressions */
        let docs = response.body.response.docs
        docs.forEach(item => {
          let session = {}
          session.id = item.id
          session.title = item.title_s
          session.year = item.year_s
          session.location = item.location_s
          session.speaker = item.speaker_name_s
          session.summary = item.summary_s
          session.organization = item.organization_s
          session.youtube_url_s ? session.youtube_url = item.youtube_url_s : ''
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
