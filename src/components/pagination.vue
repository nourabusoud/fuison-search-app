<template>
  <section>
    <ul class="nav-pagination">
      <li @click="setPage(1)" v-if="currentPage !== 1" class="first">First</li>
      <li @click="setPage(currentPage - 1)" v-if="currentPage !== 1">&#60;</li>
      <li v-for="(pageNumber, index) in totalPages" :key="index" v-if="Math.abs(pageNumber - currentPage) < 3 || pageNumber == totalPages - 1 || pageNumber == 0" @click="setPage(pageNumber)" :class="{current: currentPage === pageNumber, last: (pageNumber == totalPages - 1 && Math.abs(pageNumber - currentPage) > 3), first:(pageNumber == 0 && Math.abs(pageNumber - currentPage) > 3)}">
        {{ pageNumber }}
      </li>
      <li v-if="totalPages !== currentPage" @click="setPage(currentPage + 1)">&#62;</li>
      <li v-if="totalPages !== currentPage" @click="setPage(totalPages)" class="last">Last</li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'pagination',
  props: ['resultCount', 'itemsPerPage'],
  data () {
    return {
      currentPage: 1
    }
  },
  computed: {
    totalPages: function () {
      // get the total number of pages
      return Math.ceil(this.resultCount / this.itemsPerPage)
    }
  },
  methods: {
    setPage: function (pageNumber) {
      this.currentPage = pageNumber
      this.$router.replace(`/${this.currentPage}`)
    }
  }
}
</script>

<style>
</style>
