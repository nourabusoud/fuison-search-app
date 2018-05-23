<template>
  <div class="serach-box">
    <input type="text" class="search-field" v-model="term" @keyup.enter="searchTerm" list="history">
    <button class="search-button" v-on:click="searchTerm">Go</button>
    <!-- datalist is not supported yet by Safari -->
    <datalist id="history" v-if="searchHistory">
      <option  v-for="(item, index) in searchHistory" :key="index" :value="item.term"></option>
    </datalist>
    <button v-on:click="addToBookmarks(term)">add to bookmarks</button>
    <p class="error" v-if="bookmarkError">{{ bookmarkError }}</p>
    <div class="bookmarks">
      <span v-for="(item, index) in bookmarks" :key="index" v-on:click="searchBookmark(item.bookmark)">{{ item.bookmark }}</span>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-expressions */
export default {
  name: 'searchBox',
  data () {
    return {
      term: '',
      bookmarkError: ''
    }
  },
  computed: {
    searchHistory () {
      // Parse any JSON previously stored in allEntries
      let localSearchHistory = JSON.parse(localStorage.getItem('searchHistory'))
      if (localSearchHistory !== null && typeof localSearchHistory !== 'undefined') {
        return localSearchHistory
      } else {
        return []
      }
    },
    bookmarks () {
      let localBookmarks = JSON.parse(localStorage.getItem('bookmarks'))
      if (localBookmarks !== null && typeof localBookmarks !== 'undefined') {
        return localBookmarks
      } else {
        return []
      }
    }
  },
  mounted () {
    this.checkUrl()
  },
  methods: {
    searchTerm: function () {
      this.updateSearchHistory()
      this.$router.replace(`/1/${this.term}`) // go back to homepage when searching for a new term
    },
    searchBookmark: function (bookmark) {
      this.term = bookmark
      this.searchTerm()
    },
    updateSearchHistory: function () {
      let termExists = false
      if (this.searchHistory.length >= 10) this.searchHistory.shift() // save upto 10 terms in search history
      this.searchHistory.map(item => {
        // check if the term already exist in searchHistory
        if (item.term.toLowerCase() === this.term.toLowerCase()) {
          termExists = true
        }
      })
      // add the term to searchHistory only if it doesn't already exist
      if (!termExists && this.term !== '') {
        this.searchHistory.push({'term': this.term})
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory))
      }
    },
    checkUrl: function () {
      if (this.$route.params.term !== '' && typeof this.$route.params.term !== 'undefined') {
        this.term = this.$route.params.term
      }
    },
    addToBookmarks: function (bookmarkTerm) {
      let bookmarkExist = false
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
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
