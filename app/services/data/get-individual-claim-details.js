const config = require('../../../knexfile').intweb
const knex = require('knex')(config)

module.exports = function (claimId) {
  return knex('Claim')
    .join('Eligibility', 'Claim.EligibilityId', '=', 'Eligibility.EligibilityId')
    .join('Visitor', 'Eligibility.EligibilityId', '=', 'Visitor.EligibilityId')
    .join('Prisoner', 'Eligibility.EligibilityId', '=', 'Prisoner.EligibilityId')
    .where('Claim.ClaimId', claimId)
    .first(
      'Eligibility.Reference',
      'Claim.ClaimId',
      'Claim.DateSubmitted',
      'Claim.DateOfJourney',
      'Visitor.FirstName',
      'Visitor.LastName',
      'Visitor.DateOfBirth',
      'Visitor.NationalInsuranceNumber',
      'Visitor.HouseNumberAndStreet',
      'Visitor.Town',
      'Visitor.County',
      'Visitor.PostCode',
      'Visitor.EmailAddress',
      'Visitor.PhoneNumber',
      'Visitor.Relationship',
      'Visitor.Benefit',
      'Visitor.DWPBenefitCheckerResult',
      'Visitor.DWPCheck',
      'Prisoner.FirstName AS PrisonerFirstName',
      'Prisoner.LastName AS PrisonerLastName',
      'Prisoner.DateOfBirth AS PrisonerDateOfBirth',
      'Prisoner.PrisonNumber',
      'Prisoner.NameOfPrison', 'Prisoner.NomisCheck')
    .then(function (claim) {
      return knex('Claim')
        .join('ClaimExpense', 'Claim.ClaimId', '=', 'ClaimExpense.ClaimId')
        .where('Claim.ClaimId', claimId)
        .select('ClaimExpense.ExpenseType',
          'ClaimExpense.Cost',
          'ClaimExpense.ApprovedCost',
          'ClaimExpense.Status',
          'ClaimExpense.To',
          'ClaimExpense.From',
          'ClaimExpense.IsReturn',
          'ClaimExpense.TravelTime',
          'ClaimExpense.DurationOfTravel',
          'ClaimExpense.TicketType',
          'ClaimExpense.ClaimExpenseId')
        .orderBy('ClaimExpense.ClaimExpenseId')
        .then(function (claimExpenses) {
          var total = 0
          claimExpenses.forEach(function (expense) {
            total += expense.Cost
            expense.Cost = Number(expense.Cost).toFixed(2)
            if (expense.ApprovedCost !== null) {
              expense.ApprovedCost = Number(expense.ApprovedCost).toFixed(2)
            }
          })
          claim.Total = Number(total).toFixed(2)
          return claimExpenses
        })
        .then(function (claimExpenses) {
          return knex('Claim')
            .join('ClaimChild', 'Claim.ClaimId', '=', 'ClaimChild.ClaimId')
            .where({ 'Claim.ClaimId': claimId, 'ClaimChild.IsEnabled': true })
            .select(
              'ClaimChild.ClaimChildId',
              'ClaimChild.Name',
              'ClaimChild.DateOfBirth',
              'ClaimChild.Relationship'
            )
            .orderBy('ClaimChild.Name')
            .then(function (claimChild) {
              return {
                claim: claim,
                claimExpenses: claimExpenses,
                claimChild: claimChild
              }
            })
        })
    })
}
