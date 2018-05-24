<template>
  <div class="home">
    <pageHeader :searchTerm="searchTerm"></pageHeader>
    <div class="content-wrapper ">
      <div class="sidebar">
        <div class="bookmarks" v-if="bookmarks.length > 0">
          <h3>Your bookmarks:</h3>
          <span class="bookmark" v-for="(item, index) in bookmarks" :key="index" v-on:click="searchBookmark(item.bookmark)">{{ item.bookmark }} </span>
        </div>
        <div class="facets" v-if="resultCount">
          <div v-for="facet in facetsCollection" :key="facet.name" class="facet">
            <h3>{{ facet.name }}</h3>
            <!-- show first five items -->
            <div v-if="!facet.showMore" v-for="(item, index) in facet.collection.slice(0, 5)" :key="index">
              <input type="checkbox" :id="facet.name + '-' + index" v-on:change="toggleFacet(facet.field, item[0])" class="facet-toggle" v-model="facet.checked">
              <label :for="facet.name + '-' + index">{{ item[0] }} ({{ item[1] }})</label>
            </div>
            <!-- show the rest of the items if the user clicked on 'show more' -->
            <div v-if="facet.showMore && facet.length > 5">
              <div v-for="(item, index) in facet.collection" :key="index">
                <input type="checkbox" :id="facet.name + '-' + index" v-on:change="toggleFacet(facet.field, item[0])" class="facet-toggle" v-model="facet.checked">
                <label :for="facet.name + '-' + index">{{ item[0] }} ({{ item[1] }})</label>
              </div>
            </div>
            <div v-if="facet.length > 5" class="show-more_toggle">
              <input type="checkbox" v-model="facet.showMore" :id="facet.name">
              <label :for="facet.name">
                <span v-if="!facet.showMore">Show more</span><span v-else>Show else</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="search-result" v-if="resultCount">
        <div v-if="searchTerm !== '*:*'">
          <h2>Your search results for: {{ searchTerm }} </h2>
          <span v-on:click="addBookmark(searchTerm)">add to bookmarks</span>
          <p class="error" v-if="bookmarkError">{{ bookmarkError }}</p>
        </div>
        <div class="listing">
          <sessionSummary  v-for="session in results"  :key="session.id" :session="session"></sessionSummary>
        </div>
        <pagination v-if="resultCount > itemsPerPage" :resultCount="resultCount" :itemsPerPage="itemsPerPage"></pagination>
      </div>
      <div v-else>
        <h2>Sory, there are no results for: {{ searchTerm }}</h2>
      </div>
    </div>
  </div>
</template>
<script>
import {username, password} from '../fusion/credentials'
import pageHeader from './pageHeader'
import sessionSummary from './sessionSummary'
import pagination from './pagination'
/* eslint-disable no-unused-expressions */
export default {
  name: 'Listing',
  data () {
    return {
      title: 'Revolution Session Data',
      authSessionCreated: false,
      itemsPerPage: 10,
      resultCount: '',
      results: [],
      facetsCollection: [],
      searchFacets: {},
      bookmarkError: '',
      bookmarks: []
    }
  },
  components: {
    pageHeader,
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
    this.getBookmarks()
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
      for (let key in this.searchFacets) {
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
          facet.length = facets[key].length
          facet.showMore = false
          facet.checked = (this.searchFacets.hasOwnProperty(key)) // assign True if it's already checked
          this.facetsCollection.push(facet)
        }
        this.resultCount = response.body.response.numFound
        let docs = response.body.response.docs
        docs.forEach(item => {
          let session = {}
          session.id = item.sessionId_i
          session.title = item.title_t[0]
          session.summary = `${item.summary_t[0].split(' ').splice(0, 20).join(' ')} ...` // 50 words long
          session.year = item.year_s
          session.location = item.location_s
          session.speaker = item.speaker_name_s
          session.details = false
          this.results.push(session)
        })
      }, function (error) {
        console.log(error)
      })
    },
    toggleFacet: function (facetGroup, facetItem) {
      if (this.searchFacets.hasOwnProperty(facetGroup)) {
        delete this.searchFacets[facetGroup]
      } else {
        this.searchFacets[facetGroup] = facetItem
      }
      this.getFusionData()
    },
    getBookmarks: function () {
      let localBookmarks = JSON.parse(localStorage.getItem('bookmarks'))
      if (localBookmarks !== null && typeof localBookmarks !== 'undefined') {
        this.bookmarks = localBookmarks
      }
    },
    searchBookmark: function (bookmark) {
      this.$router.replace(`/listing/1/${bookmark}`)
    },
    addBookmark: function (bookmarkTerm) {
      let bookmarkExist = false
      if (bookmarkTerm !== '' && bookmarkTerm !== '*:*') {
        this.bookmarks.map(item => {
          // check if the term already exist in bookmarks
          if (item.bookmark.toLowerCase() === bookmarkTerm.toLowerCase()) {
            bookmarkExist = true
          }
        })
        // add the bookmark to searchHistory only if it doesn't already exist
        if (!bookmarkExist) {
          this.bookmarks.push({'bookmark': bookmarkTerm})
          localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks))
        } else {
          this.bookmarkError = 'This bookmark already exist'
          setTimeout(() => {
            this.bookmarkError = '' // reset error message
          }, 2000)
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
