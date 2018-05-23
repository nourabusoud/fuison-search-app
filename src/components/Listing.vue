<template>
  <div class="content-wrapper listing">
    <h1>{{ title }}</h1>
    <searchBox></searchBox>
    <div class="search-result" v-if="resultCount">
      <sessionSummary  v-for="session in results"  :key="session.id" :session="session"></sessionSummary>
      <pagination v-if="resultCount > itemsPerPage" :resultCount="resultCount" :itemsPerPage="itemsPerPage"></pagination>
    </div>
    <div v-else>
      <h2>Sory, there are no results for: {{ searchTerm }}</h2>
    </div>
  </div>
</template>

<script>
import {username, password} from '../fusion/credentials'
import searchBox from './searchBox'
import sessionSummary from './sessionSummary'
import pagination from './pagination'
/* eslint-disable no-unused-expressions */
export default {
  name: 'Listing',
  data () {
    return {
      title: 'Revolution Session Data',
      term: '',
      authSessionCreated: false,
      itemsPerPage: 10,
      resultCount: '',
      results: []
    }
  },
  components: {
    searchBox,
    sessionSummary,
    pagination
  },
  watch: {
    start: function () {
      this.getFusionData()
    },
    searchTerm: function () {
      this.getFusionData()
    }
  },
  computed: {
    start () {
      const pageNumber = (this.$route.params.page) ? this.$route.params.page : 1
      console.log(this.$route.params.page)
      // get start parameter for the api request
      return ((pageNumber - 1) * this.itemsPerPage)
    },
    searchTerm () {
      if (this.$route.params.term !== '' && typeof this.$route.params.term !== 'undefined') {
        return this.$route.params.term
      } else {
        return '*:*'
      }
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
      let url = `http://localhost:8764/api/apollo/apps/Revolution_Session_Data/query-pipelines/Revolution_Session_Data/collections/Revolution_Session_Data/select?echoParams=all&wt=json&json.nl=arrarr&sort&start=${this.start}&q=${this.searchTerm}&debug=true&rows=${this.itemsPerPage}`

      this.results = [] // reset results
      this.$http.get(url).then(function (response) {
        console.log('response', response)
        this.resultCount = response.body.response.numFound
        let docs = response.body.response.docs
        docs.forEach(item => {
          let session = {}
          session.id = item.sessionId_i
          session.title = item.title_t[0]
          session.year = item.year_s
          session.location = item.location_s
          session.speaker = item.speaker_name_s
          this.results.push(session)
        })
        // console.log(this.results)
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
