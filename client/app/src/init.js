;(function () {
  'use strict'

  angular.module('benchwallet.filters', [])
  angular.module('benchwallet.services', ['ngMaterial'])
  angular.module('benchwallet.directives', [])
  angular.module('benchwallet.accounts', ['ngMaterial', 'benchwallet.services', 'benchwallet.filters', 'benchwallet.addons'])
  angular.module('benchwallet.components', ['gettext', 'ngMaterial', 'benchwallet.services', 'benchwallet.accounts'])
  angular.module('benchwallet.addons', [])
  angular.module('benchwallet.constants', [])
})()
