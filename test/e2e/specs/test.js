// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .timeoutsAsyncScript(15000)
      .assert.elementPresent('.home')
      .assert.containsText('h3', 'The Apache Solr Semantic Knowledge Graph')
      // .assert.elementCount('img', 1)
      .end()
  }
}
