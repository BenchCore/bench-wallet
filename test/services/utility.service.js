'use strict'

describe('utilityService', () => {
  let utilityService, BEX_KICKOFF_DATE, BENCHPAY_CONVERSION_UNIT

  beforeEach(module('benchwallet.constants'))

  beforeEach(() => {
    module('benchwallet.services')

    inject(($injector, _$rootScope_, _BEX_KICKOFF_DATE_, _BENCHPAY_CONVERSION_UNIT_) => {
      utilityService = $injector.get('utilityService')
      BEX_KICKOFF_DATE = _BEX_KICKOFF_DATE_
      BENCHPAY_CONVERSION_UNIT = _BENCHPAY_CONVERSION_UNIT_
    })
  })

  describe('conversionToBex', () => {
    it('undefined Bex is 0 Bex', () => {
      const bex = utilityService.conversionToBex()

      expect(bex).to.eql(0)
    })

    it('0 Bex is 0 Bex', () => {
      const bex = utilityService.conversionToBex(0)

      expect(bex).to.eql(0)
    })

    it('1 BexUnit is 1 Bex', () => {
      const bex = utilityService.conversionToBex(BENCHPAY_CONVERSION_UNIT)

      expect(bex).to.eql(1)
    })

    it('1/2 BexUnit is 0.5 Bex', () => {
      const bex = utilityService.conversionToBex(BENCHPAY_CONVERSION_UNIT / 2)

      expect(bex).to.eql(0.5)
    })

    it('1111111 part of BexUnit is human readable amount of Bex', () => {
      const bex = utilityService.conversionToBex(BENCHPAY_CONVERSION_UNIT / 1111111)

      expect(bex).to.eq('0.000000900000090000009')
    })

    it('1111111 part of BexUnit is human readable amount of Bex, 0 decimals', () => {
      const bex = utilityService.conversionToBex(BENCHPAY_CONVERSION_UNIT / 1111111, false, 0)

      expect(bex).to.eq('0')
    })

    it('1111111 part of BexUnit is human readable amount of Bex, 7 decimals', () => {
      const bex = utilityService.conversionToBex(BENCHPAY_CONVERSION_UNIT / 1111111, false, 7)

      expect(bex).to.eq('0.0000009')
    })

    it('11111111 part of Bex is precise amount of Bex', () => {
      const bex = utilityService.conversionToBex(BENCHPAY_CONVERSION_UNIT / 11111111, true)

      expect(bex).to.be.within(9.00000009000000e-8, 9.00000009000002e-8)
    })

    it('11111111 part of Bex is precise amount of Bex, 0 decimals', () => {
      const bex = utilityService.conversionToBex(BENCHPAY_CONVERSION_UNIT / 11111111, true, 0)

      expect(bex).to.eq('0')
    })

    it('11111111 part of Bex is precise amount of Bex, 7 decimals', () => {
      const bex = utilityService.conversionToBex(BENCHPAY_CONVERSION_UNIT / 11111111, true, 7)

      expect(bex).to.eq('0.0000001')
    })
  })

  describe('bexToOtherValue', () => {
    it('undefined Bex is 0 Bex', () => {
      const bex = utilityService.bexToOtherValue()

      expect(bex).to.eql(0)
    })

    it('0 Bex is 0 Bex', () => {
      const bex = utilityService.bexToOtherValue(0)

      expect(bex).to.eql(0)
    })

    it('1 Bex is 1 BexUnit', () => {
      const bex = utilityService.bexToOtherValue(1)

      expect(bex).to.eql(BENCHPAY_CONVERSION_UNIT)
    })

    it('0.5 Bex is 0.5 BexUnit', () => {
      const bex = utilityService.bexToOtherValue(0.5)

      expect(bex).to.eql(BENCHPAY_CONVERSION_UNIT / 2)
    })

    it('11.11111111111 bex is correct Bex amount', () => {
      const bex = utilityService.bexToOtherValue(11.11111111111)

      expect(bex).to.eq(1111111111.111)
    })

    it('11.11111111111 bex is correct Bex amount, 0 decimals', () => {
      const bex = utilityService.bexToOtherValue(11.11111111111, 0)

      expect(bex).to.eq('1111111111')
    })

    it('11.11111111111 bex is correct Bex amount, 2 decimals', () => {
      const bex = utilityService.bexToOtherValue(11.11111111111, 2)

      expect(bex).to.eq('1111111111.11')
    })
  })

  describe('numberStringToFixed', () => {
    it('input is not a string, returns input value', () => {
      expect(utilityService.numberStringToFixed()).to.eq()
      expect(utilityService.numberStringToFixed(null)).to.eq(null)
      expect(utilityService.numberStringToFixed(1)).to.eq(1)
      const obj = {}
      expect(utilityService.numberStringToFixed(obj)).to.eq(obj)
    })

    it('12.345, no value for decimals, returns input', () => {
      expect(utilityService.numberStringToFixed('12.345')).to.eq('12.345')
    })

    it('12.345, 0 decimals, returns 12', () => {
      expect(utilityService.numberStringToFixed('12.345', 0)).to.eq('12')
    })

    it('12.345, 2 decimals, returns 12.34', () => {
      expect(utilityService.numberStringToFixed('12.345', 2)).to.eq('12.34')
    })

    it('12.345, 4 decimals, returns 12.3450', () => {
      expect(utilityService.numberStringToFixed('12.345', 4)).to.eq('12.3450')
    })

    it('12, 2 decimals, returns 12.00', () => {
      expect(utilityService.numberStringToFixed('12', 2)).to.eq('12.00')
    })
  })

  describe('dateToBexStamp', () => {
    it('input ist not defined, returns null', () => {
      expect(utilityService.dateToBexStamp()).to.eq(null)
      expect(utilityService.dateToBexStamp(null)).to.eq(null)
    })

    it('input is BenchPay launch time, returns 0', () => {
      expect(utilityService.dateToBexStamp(BEX_KICKOFF_DATE)).to.eq(0)
    })

    it('input is BEFORE BenchPay launch time, returns null', () => {
      expect(utilityService.dateToBexStamp(new Date(Date.UTC(2017, 2, 21, 12, 59, 59, 59)))).to.eq(null)
    })

    it('input is a utc date, returns correct timestamp', () => {
      expect(utilityService.dateToBexStamp(new Date(Date.UTC(2017, 10, 10, 10, 0, 0, 0)))).to.eq(20206800)
    })

    it('input is a local date, returns correct timestamp', () => {
      // since this is plus 1, this means that in UTC, it's currently 09:00, therefore the timestamphas to be 1 hour shorter than the one above
      const localDate = new Date('Fri Nov 10 2017 10:00:00 GMT+0100 (Romance Standard Time)')
      const oneHourInSeconds = 60 * 60
      expect(utilityService.dateToBexStamp(localDate)).to.eq(20206800 - oneHourInSeconds)
    })
  })

  describe('bexStampToDate', () => {
    it('input ist not a number, returns null', () => {
      expect(utilityService.bexStampToDate()).to.eq(null)
      expect(utilityService.bexStampToDate(null)).to.eq(null)
      expect(utilityService.bexStampToDate('abc')).to.eq(null)
      expect(utilityService.bexStampToDate({})).to.eq(null)
    })

    it('input is 0, returns bex launch date', () => {
      expect(utilityService.bexStampToDate(0).getTime()).to.eq(BEX_KICKOFF_DATE.getTime())
    })

    it('input is lower than 0, returns null', () => {
      expect(utilityService.bexStampToDate(-1)).to.eq(null)
    })

    it('input is a normal timestamp, returns correct date', () => {
      expect(utilityService.bexStampToDate(20206800).getTime()).to.eq(new Date(Date.UTC(2017, 10, 10, 10, 0, 0, 0)).getTime())
    })
  })
})
