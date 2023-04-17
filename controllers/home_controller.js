const Post = require('../models/post');

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

    Post.find({}).populate('user').exec()
        .then(posts => {
            return res.render('home', {
                title: "Home",
                posts: posts
            });
        })
        .catch(err => {
            console.error(err);
            // handle error
        });

};
