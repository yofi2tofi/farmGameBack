const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { UserModel } = require('../db/db.module');
const { generateSalt, generateHashedPassword } = require('../util/encryption');

passport.use(
  'local-signup',
  new LocalStrategy(
    { usernameField: 'username', passwordField: 'password' },
    async (username, password, done) => {
      if (await UserModel.findOne({ 'local.username': username })) {
        return done('Already exist', false);
      }

      try {
        const salt = generateSalt();
        const user = new UserModel({
          method: 'local',
          role: 'user',
          local: {
            username,
            salt,
            hashedPassword: generateHashedPassword(salt, password)
          }
        });

        await user.save();

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.use(
  'local-signin',
  new LocalStrategy(
    { usernameField: 'username', passwordField: 'password' },
    async (username, password, done) => {
      try {
        const user = await UserModel.findOne({
          'local.username': username
        });

        if (!user) {
          return done("User doesn't exist", false);
        }

        if (
          generateHashedPassword(user.local.salt, password) !==
          user.local.hashedPassword
        ) {
          return done('password is wrong', false);
        }

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
