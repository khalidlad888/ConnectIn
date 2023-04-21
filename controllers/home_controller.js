const Post = require('../models/post');
const User = require('../models/user');

// module.exports.home = function (req, res) {
//     // console.log(req.cookies);
//     // res.cookie('user_id', 25);

// Post.find({}, function (err, posts){
//     return res.render('home', {
//         title: "Faceloop | Home",
//         posts: posts
//     });
//     });
// };


module.exports.home = function (req, res) {
    // console.log(req.cookies);
    // res.cookie('user_id', 25);

    // Post.find({})
    //     .then(posts => {
    //         return res.render('home', {
    //             title: 'Home',
    //             posts: posts
    //         });
    //     })
    //     .catch(err => {
    //         console.error(err);
    //         return res.redirect('back');
    //     });

    Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })
        .exec()
        .then(posts => {
            User.find({}).then(users => {
                return res.render('home', {
                    title: "Home",
                    posts: posts,
                    all_users: users
                });
            })
        })
        .catch(err => {
            console.error(err);
            // handle error
        });

};
