'use strict'

describe('feedService', () => {
  let feedService

  beforeEach(() => {
    module('benchwallet.services')

    inject($injector => {
      feedService = $injector.get('feedService')
    })
  })

  describe('fetchBlogEntries', () => {
    it('fetches and parses the BenchPay.io feed URL', () => {
      const stub = sinon.stub(feedService, 'fetchAndParse').resolves('OK')
      feedService.fetchBlogEntries()
      expect(stub.firstCall.args[0]).to.eql('https://medium.com/feed/@benchpay')
    })
  })
})
