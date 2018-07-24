'use strict'

const Application = require('spectron').Application
const electron = require('electron')
const _path = require('path')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const userData = require(_path.resolve(__dirname, './user_data'))
const commands = require(_path.resolve(__dirname, './commands'))

global.before(() => {
  chai.should()
  chai.use(chaiAsPromised)
})

const timeout = process.env.CI ? 20000 : 10000

const hooks = {
  createApp: function () {
    this.timeout(timeout)

    before(function () {
      this.app = new Application({
        path: electron,
        args: [
          _path.join(__dirname, '../..')
        ],
        waitTimeout: timeout
      })
    })
  },

  beforeBlock: function (options) {
    userData.clearSettings()

    return this.app.start().then(app => {
      chaiAsPromised.transferPromiseness = app.transferPromiseness

      commands(app)

      if (!options) {
        options = {}
      }

      // Tests should use the fake path usually
      if (!options.useRealPath) {
        app.electron.remote.app.setPath('userData', userData.getTestPath())
      } else if (!options.ignoreDangerousWarning) {
        console.warn('\n\tTHIS IS THE DANGEROUS PATH OF THE REAL APP!\n\tBAD THINGS COULD HAPPEN IF YOU USE IT:\n\tYOU MAY CRY AFTER LOSING YOUR BENCHMARKS (BEX)!\n')
      }

      return app.client.waitUntilWindowLoaded()
    })
  },

  afterBlock: function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  }
}

module.exports = hooks
