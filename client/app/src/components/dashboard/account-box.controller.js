;(function () {
  'use strict'

  /**
   * NOTE: This component still uses parts of the AccountController
   */

  angular
    .module('benchwallet.components')
    .component('accountBox', {
      templateUrl: 'src/components/dashboard/account-box.html',
      bindings: {
        accountCtrl: '=',
        addressbookCtrl: '='
      },
      controller: ['$scope', 'networkService', 'accountService', 'utilityService', 'gettextCatalog', 'gettext', 'toastService', '$timeout', 'marketService', AccountBoxController]
    })

  function AccountBoxController ($scope, networkService, accountService, utilityService, gettextCatalog, gettext, toastService, $timeout, marketService) {
    this.$onInit = () => {
      // Alias that is used on the template
      this.ac = this.accountCtrl

      this.myAccountsType = this.createAccountType(gettext('Bench Accounts // Total Balance: '),
                                                   this.ac.myAccounts,
                                                   this.ac.getAllAccounts,
                                                   utilityService.createRefreshState(gettext('Bench accounts refreshed'), gettext('Could not refresh accounts')),
                                                   this.ac.createAccount,
                                                   gettext('Create Bench Account'),
                                                   this.ac.importAccount,
                                                   gettext('Import Bench Account'))

      this.contactsType = this.createAccountType(gettext('Bench Contacts // Total Balance Of Contacts:'),
                                                 this.addressbookCtrl.getContacts,
                                                 this.addressbookCtrl.getContacts,
                                                 utilityService.createRefreshState(gettext('Bench contacts refreshed'), gettext('Could not refresh Bench contacts')),
                                                 () => this.addressbookCtrl.addAddressbookContact(() => this.refreshAccounts()),
                                                 gettext('Add Bench Contact'))

      if (this.myAccountsType.getAccountsToRefresh().length || !this.contactsType.getAccountsToRefresh().length) {
        this.selectedAccountType = this.myAccountsType
      } else {
        this.selectedAccountType = this.contactsType
      }

      this.accountTypes = [this.myAccountsType, this.contactsType]

      let didInitialRefresh = false
      networkService.getConnection()
        .then(() => {},
              () => {},
              (connectedPeer) => {
                if (connectedPeer.isConnected && !didInitialRefresh) {
                  $timeout(this.refreshAccounts, 500)
                  didInitialRefresh = true
                }
              })
    }

    this.createAccountType = (title,
                              getDisplayAccountsFunc,
                              getAccountsToRefreshFunc,
                              refreshState,
                              createAccountFunc,
                              createAccountText,
                              importAccountFunc,
                              importAccountText) => {
      return {
        title: gettextCatalog.getString(title),
        getDisplayAccounts: getDisplayAccountsFunc,
        getAccountsToRefresh: getAccountsToRefreshFunc,
        createAccount: createAccountFunc,
        createAccountText: gettextCatalog.getString(createAccountText),
        importAccount: importAccountFunc,
        importAccountText: gettextCatalog.getString(importAccountText),
        refreshState: refreshState
      }
    }

    this.refreshAccounts = (showToast) => {
      this.refreshAccountBalances(showToast,
                                  this.selectedAccountType.getAccountsToRefresh(),
                                  this.selectedAccountType.refreshState)
    }

    this.refreshAccountBalances = (showToast, accounts, refreshState) => {
      if (!accounts.length || !refreshState.shouldRefresh()) {
        return
      }

      marketService.updateTicker()

      accounts.forEach(account => {
        const state = refreshState.create()
        accountService
          .refreshAccount(account)
          .then(updated => { account.balance = updated.balance })
          .catch(() => { state.hasError = true })
          .finally(() => {
            state.isFinished = true
            refreshState.updateRefreshState(showToast ? toastService : null)
          })
      })
    }

    this.getTotalBalance = (accountType) => {
      const total = accountType.getAccountsToRefresh().reduce((sum, account) => {
        return sum + parseInt(account.balance || 0)
      }, 0)

      return utilityService.convertToBex(total, true, 2)
    }

    this.currencyBalance = (accountType) => {
      const market = this.accountCtrl.market
      const price = market && market.price ? market.price : 0

      return this.getTotalBalance(accountType) * price
    }
  }
})()
