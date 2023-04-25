const { findOne } = require('../models/user');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function (req, res) {
    // return res.end('<h1> User Profile </h1>');
    User.findById(req.params.id).then(user => {
        return res.render('profile', {
            title: "Profile",
            profile_user: user
        });
    });
};


module.exports.update = async function (req, res) {
    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function (err) {
                if (err) { console.log('*****MulterError:', err) };

                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file) {
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    };

                    user.avatar = User.avatarPath + '/' + req.file.filename
                };
                user.save();
                req.flash('success', 'Profile Updated Successfully');
                return res.redirect('back');
            });

        } catch (err) {
            req.flash('error', err);
            return res.redirect('back');
        }

    } else {
        return res.status(401).send('Unauthorized')
    };
};



module.exports.chats = function (req, res) {
    return res.end('<h1> User Chats</h1>');
};

//rendering the signup page
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    };

    return res.render('user_sign_up', {
        title: "Faceloop | Sign Up"
    });
};

//rendering the signin page
module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    };

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
                req.flash('success', 'Signed Up Successfully');
                return res.redirect('/users/sign-in');
            } else {
                return res.redirect('back');
            };
        });
    } catch (err) {
        req.flash('error', err);
        // console.log(err, "Error in creating the user");
    };
};

//Sign ip data and create the session for the user
module.exports.createSession = function (req, res) {
    req.flash('success', 'Signed In Successfully');
    return res.redirect('/');
};

module.exports.destroySession = function (req, res) {
    req.logout(function (err) {
        if (err) {
            req.flash('error', 'Error in logging out');
            // console.log(err, "Error in logging out");
        };
        req.flash('success', 'Signed Out Successfully');
        return res.redirect('/');
    });
};