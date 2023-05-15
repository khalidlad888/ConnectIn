const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');


//Tell passport to use new google strategy
passport.use(new googleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_call_back_url
},
    async function (accessToken, refreshToken, profile, done) {
        //Find a user
        try {
            let user = await User.findOne({ email: profile.emails[0].value }).exec()
            console.log(profile);

            if (user) {
                //If user found, set him as req.user
                return done(null, user);
            } else {
                //If not found, create user and set as req.user
                let user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                });

                return done(null, user);
            }
        }catch(err){
            if (err) {
                console.log('Error in user google auth', err);
                return done(err, null);
            };
        };
    })

);


module.exports = passport;