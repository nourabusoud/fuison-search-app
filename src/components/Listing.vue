<template>
  <div class="listing">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
import {username, password} from '../fusion/credentials'

export default {
  name: 'Listing',
  data () {
    return {
      msg: 'Search stuff here'
    }
  },
  mounted () {
    this.getFusionData()
  },
  methods: {
    getFusionData: function () {
      const authUrl = 'http://localhost:8764/api/session?realmName=native'

      const data = { username, password, crossDomain: true }
      console.log(data)
      this.$http.post(authUrl, data).then(function (response) {
        console.log(response)
      }, function (error) {
        console.log(error)
      })

      let url = 'http://localhost:8764/api/apollo/apps/Revolution_Session_Data_Search/query-pipelines/_lw_qwb_tmp_49394373810908136/collections/Revolution_Session_Data_Search/select?echoParams=all&wt=json&json.nl=arrarr&sort&start=0&q=*:*&debug=true&rows=10'

      this.$http.get(url).then(function (response) {
        console.log(response.body.response.docs)

        let docs = response.body.response.docs

        docs.forEach(function (item, key) {
          console.log(item.title_t)
        })
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
