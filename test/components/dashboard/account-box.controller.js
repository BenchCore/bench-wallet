'use strict'

describe('AccountBoxController', () => {
  const expect = chai.expect

  let ctrl, BENCHPAY_CONVERSION_UNIT, accounts, bindings, accountType, accountService

  beforeEach(module('benchwallet.constants'))

  beforeEach(() => {
    module('benchwallet.components', $provide => {
    })

    inject((_$componentController_, _BENCHPAY_CONVERSION_UNIT_, $injector) => {
      BENCHPAY_CONVERSION_UNIT = _BENCHPAY_CONVERSION_UNIT_
      accounts = [
        { balance: 10 * BENCHPAY_CONVERSION_UNIT },
        { balance: 15 * BENCHPAY_CONVERSION_UNIT },
        { balance: 5 * BENCHPAY_CONVERSION_UNIT },
        {}
      ]

      bindings = {
        accountCtrl: {
          getAllAccounts () { return accounts },
          currency: {
            name: 'btc'
          },
          market: {
            price: '0.1' // Next year price? lol
          }
        }
      }

      ctrl = _$componentController_('accountBox', null, bindings)
      const utilityService = $injector.get('utilityService')
      accountService = $injector.get('accountService')

      accountType = ctrl.createAccountType('Test Accounts Type',
                                           bindings.accountCtrl.getAllAccounts,
                                           bindings.accountCtrl.getAllAccounts,
                                           utilityService.createRefreshState('Contacts refreshed', 'Could not refresh contacts'))
    })
  })

  describe('getTotalBalance()', () => {
    it('sums the balance (in BEX, formatted) of all accounts', () => {
      expect(ctrl.getTotalBalance(accountType)).to.equal('30.00')
    })
  })

  describe('currencyBalance()', () => {
    context('when it is connected to a maket', () => {
      it('sums the balance (in the configured currency, formatted) of all accounts', () => {
        expect(ctrl.currencyBalance(accountType)).to.equal(3)
      })
    })

    context("when it isn't connected to a maket", () => {
      beforeEach(() => {
        ctrl.accountCtrl.market = {}
      })

      it('returns 0', () => {
        expect(ctrl.currencyBalance(accountType)).to.equal(0)
      })
    })
  })

  describe('refreshAccountBalances()', () => {
    context('when the balance of an account changes', () => {
      it('updates the balance', () => {
        expect(ctrl.getTotalBalance(accountType)).to.equal('30.00')
        accountService.refreshAccount = (account) => {
          if (account.balance) {
            account.balance = account.balance / 2
          }
          // we need to create a bluebirdpromise, because on a normal promise there is no finally
          const bluebirdpromise = {}
          bluebirdpromise.then = (resolve) => {
            resolve(account)
            return bluebirdpromise
          }
          bluebirdpromise.catch = () => bluebirdpromise
          bluebirdpromise.finally = () => bluebirdpromise

          return bluebirdpromise
        }
        ctrl.refreshAccountBalances(false, accountType.getAccountsToRefresh(), accountType.refreshState)
        expect(ctrl.getTotalBalance(accountType)).to.equal('15.00')
      })
    })
  })
})
