const Post = require('../models/post');
const User = require('../models/user');


module.exports.home = function (req, res) {
    Post.find({})
        .sort('-createdAt')
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
