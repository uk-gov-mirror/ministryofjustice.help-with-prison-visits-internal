const passport = require('passport')

module.exports = function (router) {
  router.get('/auth/:provider', passport.authenticate('oauth2'))

  router.get('/auth/:provider/callback', passport.authenticate('oauth2', { failureRedirect: '/unauthorised' }),
    function (req, res) {
      // Successful authentication, redirect home.
      return res.redirect('/')
    })

  router.get('/unauthorised', function (req, res) {
    return res.status(401).render('includes/error-401', { title: 'APVS - unauthorised' })
  })
}
