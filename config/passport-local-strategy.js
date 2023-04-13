const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//Authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email'
},
    function (email, password, done) {
        try {
            User.findOne({ email: email }).then((user) => {
                if (!user || user.password != password) {
                    console.log("Invalid username or password");
                    return done(null, false);
                }

                return done(null, user);
            });
        } catch (err) {
            if (err) {
                console.log("Error in finding user --> Passport");
                return done(err);
            };
        };
        //     User.findOne({email:email}, function(err, user){
        //         if (err){
        //             console.log("Error in finding user --> Passport");
        //             return done(err);
        //         };

        //         if(!user || user.password != password){
        //             console.log("Invalid username or password");
        //             return done(null, false);
        //         };

        //         return done(null, user);
        //     });
    }
))

//Serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

//Deserializing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
    try {
        User.findById(id).then((user) => {
            return done(null, user);
        });
        // User.findById(id, function (err, user) {
        //     if (err) {
        //         console.log("Error in finding user --> Passport");
        //         return done(err);
        //     };

        //     return done(null, user);
        // });
    } catch (err){
        console.log("Error in finding user --> Passport");
        return done(err);
    };
});


//check if user is authenticated
passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    };

    //if the user is not signed in 
    return res.redirect('/users/sign-in')
};

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    };

    next();
};

module.exports = passport;