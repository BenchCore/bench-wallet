;(function () {
  'use strict'

  angular.module('benchwallet.services')
    .service('utilityService', ['BEX_CONVERSION_UNIT', 'BEX_LAUNCH_DATE', UtilityService])

  // this service should not have any dependencies to other services!
  function UtilityService (BEX_CONVERSION_UNIT, BEX_LAUNCH_DATE) {
    function convertToBex (amount, keepPrecise, numberOfDecimals) {
      if (!amount) {
        return 0
      }

      let bex = amount / BEX_CONVERSION_UNIT

      if (!keepPrecise) {
        bex = numberToFixed(bex)
      }

      if (typeof numberOfDecimals !== 'number') {
        return bex
      }

      if (typeof bex === 'number') {
        return bex.toFixed(numberOfDecimals)
      }

      // if we have a string, 'toFixed' won't work, so we use our custom implementation for that
      return numberStringToFixed(bex, numberOfDecimals)
    }

    function convertBex (amount, numberOfDecimals) {
      if (!amount) {
        return 0
      }

      const bex = amount * BEX_CONVERSION_UNIT
      return typeof numberOfDecimals !== 'number' ? bex : bex.toFixed(numberOfDecimals)
    }

    function numberStringToFixed (bex, numberOfDecimals) {
      if (typeof bex !== 'string' || typeof numberOfDecimals === 'undefined') {
        return bex
      }

      const splitted = bex.split('.')

      if (numberOfDecimals === 0) {
        return splitted[0]
      }

      const decimals = splitted[1] || []
      let newDecimals = ''
      for (let i = 0; i < numberOfDecimals; i++) {
        if (i < decimals.length) {
          newDecimals += decimals[i]
        } else {
          newDecimals += '0'
        }
      }

      return splitted[0] + '.' + newDecimals
    }

    function dateToBexStamp (date) {
      if (!date) {
        return null
      }

      date = new Date(date.toUTCString())

      const timestamp = parseInt((date.getTime() - BEX_LAUNCH_DATE.getTime()) / 1000)
      return timestamp < 0 ? null : timestamp
    }

    function bexStampToDate (bexRelativeTimeStamp) {
      if (typeof bexRelativeTimeStamp !== 'number' || bexRelativeTimeStamp < 0) {
        return null
      }

      const bexLaunchTime = parseInt(BEX_LAUNCH_DATE.getTime() / 1000)

      return new Date((bexRelativeTimeStamp + bexLaunchTime) * 1000)
    }

    function createRefreshState (successMessage, errorMessage) {
      const stateObject = {}

      stateObject.states = []

      stateObject.isRefreshing = false

      stateObject.create = () => {
        const state = { isFinished: false, hasError: false }
        stateObject.states.push(state)
        return state
      }

      stateObject.shouldRefresh = () => {
        if (stateObject.isRefreshing) {
          return false
        }

        stateObject.isRefreshing = true
        return true
      }

      stateObject.updateRefreshState = (toastService) => {
        const areAllFinished = stateObject.states.every(state => state.isFinished)
        const hasAnyError = stateObject.states.some(state => state.hasError)

        if (!areAllFinished) {
          return
        }

        stateObject.isRefreshing = false
        stateObject.states = []

        if (!toastService) {
          return
        }

        if (!hasAnyError) {
          toastService.success(successMessage, 3000)
        } else {
          toastService.error(errorMessage, 3000)
        }
      }

      return stateObject
    }

    function numberToFixed (x) {
      let e
      if (Math.abs(x) < 1.0) {
        e = parseInt(x.toString().split('e-')[1])
        if (e) {
          x *= Math.pow(10, e - 1)
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2)
        }
      } else {
        e = parseInt(x.toString().split('+')[1])
        if (e > 20) {
          e -= 20
          x /= Math.pow(10, e)
          x += (new Array(e + 1)).join('0')
        }
      }
      return x
    }

    return {
      convertToBex: convertToBex,
      convertBex: convertBex,
      numberStringToFixed: numberStringToFixed,

      dateToBexStamp: dateToBexStamp,
      bexStampToDate: bexStampToDate,

      createRefreshState: createRefreshState
    }
  }
})()
