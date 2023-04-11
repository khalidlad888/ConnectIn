const { findOne } = require('../models/user');
const User = require('../models/user');

module.exports.profile = function (req, res) {
    // return res.end('<h1> User Profile </h1>');

    return res.render('profile', {
        title: "Profile"
    });
};

module.exports.chats = function (req, res) {
    return res.end('<h1> User Chats</h1>');
};

//rendering the signup page
module.exports.signUp = function (req, res) {
    return res.render('user_sign_up', {
        title: "Faceloop | Sign Up"
    });
};

//rendering the signin page
module.exports.signIn = function (req, res) {
    return res.render('user_sign_in', {
        title: "Faceloop | Sign In"
    });
};

//get the sign up data
module.exports.create = async function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    };
    try {
        User.findOne({ email: req.body.email }).then((user) => {
            if (!user) {
                let user = User.create(req.body);
                return res.redirect('/users/sign-in');
            } else {
                return res.redirect('back');
            };
        });
    } catch (err) {
        console.log(err, "Error in creating the user");
    };
};

//Sign ip data and create the session for the user
module.exports.createSession = function (req, res) {
    //TODO later
};