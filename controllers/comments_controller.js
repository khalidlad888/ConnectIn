const Comment = require('../models/comment');
const Post = require('../models/post');



module.exports.create = function (req, res) {
    Post.findById(req.body.post)
        .then(function (post) {
            if (!post) {
                return res.status(404).send('Post not found');
            }
            req.flash('success', 'Comment Added Successfully');

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
            req.flash('error', err);
            console.error('Error in adding comment:', err);
            res.status(500).send('Error in adding comment');
        });
};


module.exports.destroy = function(req, res){
    Comment.findById(req.params.id)
    .then(comment => {
        if (comment.user == req.user.id){
            let postId = comment.post;

            comment.deleteOne()
            .then(() => {
                req.flash('success', 'Comment Deleted Successfully');
                return Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}})
                .then(() => {
                    return res.redirect('back');
                })
                .catch(err => {
                    console.error(err);
                    return res.redirect('back');
                });
            })
            .catch(err => {
                console.error(err);
                return res.redirect('back');
            });
        }else{
            return res.redirect('back');
        }
    })
    .catch(err => {
        console.error(err);
        return res.redirect('back');
    });
};
