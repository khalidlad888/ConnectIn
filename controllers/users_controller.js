const { findOne } = require('../models/user');
const User = require('../models/user');

module.exports.profile = function (req, res) {
    // return res.end('<h1> User Profile </h1>');
    User.findById(req.params.id).then(user => {
        return res.render('profile', {
            title: "Profile",
            profile_user: user
        });
    });
};

// module.exports.update = function (req, res) {
//     if (req.user.id == req.params.id) {
//         User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
//             return res.redirect('back');
//         })
//     }else{
//         return res.status(401).send('Unauthorized')
//     };
// };

module.exports.update = function (req, res) {
    if (req.user.id == req.params.id) {
        User.findByIdAndUpdate(req.params.id, req.body)
            .then((user) => {
                return res.redirect('back');
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            });
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
    return res.redirect('/');
};

module.exports.destroySession = function (req, res) {
    req.logout(function (err) {
        if (err) {
            console.log(err, "Error in logging out");
        };
        return res.redirect('/');
    });
};