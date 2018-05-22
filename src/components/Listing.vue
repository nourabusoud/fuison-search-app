<template>
  <div class="content-wrapper listing">
    <h1>{{ title }}</h1>
    <div class="serach-box">
      <input type="text" class="search-field" v-model="term" @keyup.enter="serachTerm" list="history">
      <datalist id="history" v-if="searchHistory">
        <option  v-for="(item, index) in searchHistory" :key="index" :value="item.term"></option>
      </datalist>
      <button class="search-button" v-on:click="serachTerm">Go</button>
    </div>
    <div class="search-result">
      <sessionSummary  v-for="session in results"  :key="session.id" :session="session"></sessionSummary>
    </div>
    <pagination v-if="resultCount > itemsPerPage" :resultCount="resultCount" :itemsPerPage="itemsPerPage"></pagination>
  </div>
</template>

<script>
import {username, password} from '../fusion/credentials'
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
    sessionSummary,
    pagination
  },
  watch: {
    start: function () {
      this.getFusionData()
    }
  },
  computed: {
    start () {
      const pageNumber = (this.$route.params.page) ? this.$route.params.page : 1
      return ((pageNumber - 1) * this.itemsPerPage)
    },
    searchHistory () {
      let localSearchHistory = JSON.parse(localStorage.getItem('searchHistory'))
      if (localSearchHistory !== null && typeof localSearchHistory !== 'undefined') {
        return localSearchHistory
      } else {
        return []
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
      let serachTerm = (this.term !== '') ? this.term : '*:*'

      let url = `http://localhost:8764/api/apollo/apps/Revolution_Session_Data/query-pipelines/Revolution_Session_Data/collections/Revolution_Session_Data/select?echoParams=all&wt=json&json.nl=arrarr&sort&start=${this.start}&q=${serachTerm}&debug=true&rows=${this.itemsPerPage}`

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
        console.log(this.results)
      }, function (error) {
        console.log(error)
      })
    },
    serachTerm: function () {
      this.getFusionData()
      this.$router.replace(`/`) // go back to homepage when searching for a new term
      this.updateSearchHistory()
    },
    updateSearchHistory: function () {
      // Parse any JSON previously stored in allEntries
      if (this.searchHistory.length >= 10) this.searchHistory.shift() // save upto 10 terms in search history
      this.searchHistory.push({'term': this.term})
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory))
      console.log('hey', this.searchHistory)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
