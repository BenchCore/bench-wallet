;(function () {
  'use strict'

  angular.module('benchwallet.constants')
    // 1 ARK has 100000000 "arktoshi"
    .constant('BEX_CONVERSION_UNIT', Math.pow(10, 8))
    .constant('TRANSACTION_TYPES', {
      'SEND_BEX': 0,
      'CREATE_SECOND_PASSPHRASE': 1,
      'CREATE_DELEGATE': 2,
      'VOTE': 3
    })

  angular.module('benchwallet.constants')
  // all ark timestamps start at 2017/3/21 13:00
    .constant('BEX_LAUNCH_DATE', new Date(Date.UTC(2017, 2, 21, 13, 0, 0, 0)))
})()
