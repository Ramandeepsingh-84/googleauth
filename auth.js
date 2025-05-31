const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2' ).Strategy;
require('dotenv').config();
const User = require('./models/user.model');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback   : true
  },
 async function(request, accessToken, refreshToken, profile, done) {

  
try {
      const result = await User.findOrCreate(
        { googleId: profile.id },
        {
          name: profile.displayName,
          email: profile.emails[0].value,
          picture: profile.picture
        }
      );
      return done(null, result.doc);
    } catch (err) {
      return done(err);
    }
 
    // return done(null,profile);
  }

  
));

passport.serializeUser(function(user,done){
    done(null, user);
})

passport.deserializeUser(function(user,done){
    done(null, user);
})