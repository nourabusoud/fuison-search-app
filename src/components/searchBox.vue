<template>
  <div class="content-wrapper listing">
    <div class="serach-box">
      <input type="text" class="search-field" v-model="term" @keyup.enter="serachTerm" list="history">
      <!-- datalist is not supported yet by Safari -->
      <datalist id="history" v-if="searchHistory">
        <option  v-for="(item, index) in searchHistory" :key="index" :value="item.term"></option>
      </datalist>
      <button class="search-button" v-on:click="serachTerm">Go</button>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-expressions */
export default {
  name: 'searchBox',
  data () {
    return {
      term: ''
    }
  },
  computed: {
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
    this.checkUrl()
  },
  methods: {
    serachTerm: function () {
      this.$router.replace(`/1/${this.term}`) // go back to homepage when searching for a new term
      this.updateSearchHistory()
    },
    updateSearchHistory: function () {
      let termExists = false
      // Parse any JSON previously stored in allEntries
      if (this.searchHistory.length >= 10) this.searchHistory.shift() // save upto 10 terms in search history
      this.searchHistory.map(item => {
        // check if the term already exist in searchHistory
        if (item.term === this.term) {
          termExists = true
        }
      })
      // add the term to searchHistory only if it doesn't already exist
      if (!termExists) {
        console.log('here')
        this.searchHistory.push({'term': this.term})
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory))
      }
    },
    checkUrl: function () {
      if (this.$route.params.term !== '' && typeof this.$route.params.term !== 'undefined') {
        this.term = this.$route.params.term
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
