const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

const env = require('./environment');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt_secret
}

passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){
    try{
        User.findById(jwtPayLoad._id).then((user) => {
            if (user){
                return done(null, user);
            }else{
                return done(null, false);
            }
        })
    }catch(err){
        console.log(err,'Error in finding user from JWT');
        return done(err, false);
    }; 
}));


module.exports = passport;