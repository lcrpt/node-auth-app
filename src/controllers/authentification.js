const _ = require('lodash');
const jwt = require('jwt-simple');
const passport = require('passport');

const User = require('../models/user');

function getTokenForUser(user) {
  const payload = {
    sub: user.id,
    iat: new Date().getTime(),
  };

  return jwt.encode(payload, process.env.SECRET);
}

const signUp = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }, (err, existingUser) => {
    if (err) return next(err);

    if (existingUser) {
      return res.status(422).send({ message: 'Email already exist' });
    }

    if (_.isEmpty(email) || _.isEmpty(password)) {
      return res.status(422).send({ message: 'Email or Password empty' });
    }

    const user = new User({ email, password });

    return user.save(error => {
      if (error) return next(error);

      return res.json({ token: getTokenForUser(user) });
    });
  });
};

const signIn = (req, res, next) => passport.authenticate('local', (err, user) => {
  if (err) return next(err);

  if (!user) {
    return res.status(500).send({ message: 'Wrong credentials' });
  }

  return res.json({ token: getTokenForUser(user) });
})(req, res, next);

module.exports = {
  signUp,
  signIn,
};
