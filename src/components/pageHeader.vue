<template>
  <div class="page-header">
    <div class="header-content">
      <div class="logo">Revolution data</div>
      <div class="search-field">
        <input type="text" v-model="term" @keyup.enter="search" list="history">
        <button class="search-button" v-on:click="search"></button>
        <!-- datalist is not supported yet by Safari -->
        <datalist id="history" v-if="searchHistory">
          <option  v-for="(item, index) in searchHistory" :key="index" :value="item.term"></option>
        </datalist>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-expressions */
export default {
  name: 'pageHeader',
  props: ['searchTerm'],
  data () {
    return {
      term: ''
    }
  },
  watch: {
    searchTerm: function () {
      this.checkUrl()
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
    }
  },
  mounted () {
    this.checkUrl()
  },
  methods: {
    search: function () {
      this.updateSearchHistory()
      this.$router.replace(`/listing/1/${this.term}`) // go back to homepage when searching for a new term
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
