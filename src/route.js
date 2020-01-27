require('./services/passport');

const passport = require('passport');

const AuthentificationCtrl = require('./controllers/authentification');

const requireToken = passport.authenticate('jwt', { session: false });

module.exports = app => {
  app.post('/signUp', AuthentificationCtrl.signUp);

  app.get('/secretRessources', requireToken, (req, res) => {
    res.send({ result: 'This is a secure content by sign in' });
  });

  app.post('/signIn', AuthentificationCtrl.signIn);
};
