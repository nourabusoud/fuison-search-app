<template>
  <div class="content-wrapper listing">
    <h1>{{ title }}</h1>
    <searchBox></searchBox>
    <div class="search-result" v-if="resultCount">
      <div v-if="searchTerm !== '*:*'">
        <h2>Your search results for: {{ searchTerm }}</h2>
      </div>
       <div v-for="facet in facetsCollection" :key="facet.name">
        {{ facet.name }}
        <div v-for="(item, index) in facet.collection" :key="index">
          <div><span v-on:click="addFacet(facet.field, item[0])">{{ item[0] }} ({{ item[1] }})</span> <span v-on:click="removeFacet(facet.field, item[0])">X</span></div>
        </div>
      </div>
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
      results: [],
      facetsCollection: [],
      searchFacets: {}
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
      let facetsQuery = ''
      for (var key in this.searchFacets) {
        facetsQuery += (`&fq=${key}:("${this.searchFacets[key]}")`)
      }

      let url = `http://localhost:8764/api/apollo/apps/Revolution_Session_Data/query-pipelines/Revolution_Session_Data/collections/Revolution_Session_Data/select?echoParams=all&wt=json&json.nl=arrarr&sort&start=${this.start}${facetsQuery}&q=${this.searchTerm}&debug=true&rows=${this.itemsPerPage}`

      this.$http.get(url).then(function (response) {
        console.log('response', response)
        this.results = [] // reset results
        this.facetsCollection = [] // reset facets
        let facets = response.body.facet_counts.facet_fields
        for (var key in facets) {
          let facet = {}
          facet.field = key
          facet.name = key.replace('_s', '').replace('_t', '')
          facet.collection = facets[key]
          facet.search = ''
          this.facetsCollection.push(facet)
        }
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
      }, function (error) {
        console.log(error)
      })
    },
    addFacet: function (facetGroup, facetItem) {
      this.searchFacets[facetGroup] = facetItem
      this.getFusionData()
    },
    removeFacet: function (facetGroup) {
      delete this.searchFacets[facetGroup]
      this.getFusionData()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
