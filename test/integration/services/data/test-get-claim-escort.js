var expect = require('chai').expect
var dateFormatter = require('../../../../app/services/date-formatter')
var databaseHelper = require('../../../helpers/database-setup-for-tests')

var getClaimEscort = require('../../../../app/services/data/get-claim-escort')
var reference = 'GETESCORT'
var claimId
var claimEscortId

describe('services/data/get-claim-escort', function () {
  before(function () {
    return databaseHelper.insertTestData(reference, dateFormatter.now().toDate(), 'TESTING')
      .then(function (ids) {
        claimId = ids.claimId
        claimEscortId = ids.claimEscortId
      })
  })

  it('should return the expected claim escort', function () {
    return getClaimEscort(claimId)
      .then(function (result) {
        expect(result[0].ClaimEscortId).to.equal(claimEscortId)
      })
      .catch(function (error) {
        throw error
      })
  })

  after(function () {
    return databaseHelper.deleteAll(reference)
  })
})
