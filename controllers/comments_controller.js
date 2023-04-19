const Comment = require('../models/comment');
const Post = require('../models/post');

// module.exports.create = function (req, res) {
//     try {
//         Post.findById(req.body.post).then((post) => {
//             if (post) {
//                 Comment.create({
//                     content: req.body.content,
//                     post: req.body.post,
//                     user: req.user._id
//                 }, function(err, comment){
//                     if (err) {
//                         console.log(err, "Error in adding comment");
//                     };

//                     post.comments.push(comment);
//                     post.save();
//                     res.redirect('/'); 
//                 })

//             }
//         })
//     }catch(err){
//         console.log(err, "Error in adding comment");
//     }
// };


module.exports.create = function (req, res) {
    Post.findById(req.body.post)
        .then(function (post) {
            if (!post) {
                return res.status(404).send('Post not found');
            }

            return Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
        })
        .then(function (comment) {
            const postId = comment.post;

            return Post.findByIdAndUpdate(postId, { $push: { comments: comment } });
        })
        .then(function () {
            res.redirect('/');
        })
        .catch(function (err) {
            console.error('Error in adding comment:', err);
            res.status(500).send('Error in adding comment');
        });
};