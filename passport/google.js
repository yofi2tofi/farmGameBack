const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-token').Strategy;

passport.use(
  new GoogleTokenStrategy(
    {
      clientID:
        '',
      clientSecret: ''
    },
    function(accessToken, refreshToken, profile, cb) {
      console.log(accessToken, refreshToken, profile);
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
    }
  )
);
