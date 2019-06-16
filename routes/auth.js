var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');

const { UserModel } = require('../db/db.module');

const bodyValidator = require('../middlewares/userBodyValidator');

router.post('/signup', bodyValidator, (req, res, next) => {
  passport.authenticate('local-signup', async (err, user, info) => {
    if (err === 'Already exist') {
      return res.status(500).json({ message: 'Пользователь уже существует' });
    }
    if (err) {
      return res.status(500).json({ message: 'Что-то пошло не так =(' });
    }
    if (user) {
      const accessToken = jwt.sign({ _id: user._id }, 'secret', {
        expiresIn: '24h'
      });
      const refreshToken = jwt.sign({ _id: user._id }, 'secret', {
        expiresIn: '24h'
      });

      const updateUser = await UserModel.findByIdAndUpdate(user._id, {
        $set: { refreshToken }
      }).exec();

      return res.json({ accessToken, refreshToken });
    }
  })(req, res, next);
});

router.post('/signin', bodyValidator, (req, res, next) => {
  passport.authenticate('local-signin', async (err, user, info) => {
    if (err === "User doesn't exist") {
      return res.status(400).json({ message: 'Пользователь не существует' });
    }
    if (err === 'password is wrong') {
      return res.status(400).json({ message: 'Пароль не верен' });
    }
    if (err) {
      return res.status(500).json({ message: 'Что-то пошло не так =(' });
    }
    if (user) {
      const accessToken = jwt.sign({ _id: user._id }, 'secret', {
        expiresIn: '24h'
      });
      const refreshToken = jwt.sign({ _id: user._id }, 'secret', {
        expiresIn: '24h'
      });

      const updateUser = await UserModel.findByIdAndUpdate(user._id, {
        $set: { refreshToken }
      }).exec();

      return res.json({ accessToken, refreshToken });
    }
  })(req, res, next);
});

router.get(
  '/google',
  passport.authenticate('google-token', { session: false }),
  function(req, res) {
    res.send(req.user);
  }
);

// router.get('/google/callback', passport.authenticate('google-token'), function(
//   req,
//   res
// ) {
//   // res.redirect('/');
// });

module.exports = router;
