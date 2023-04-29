const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');


module.exports.create = async function (req, res) {
    try {
        let post = await Post.findById(req.body.post);
        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            if (comment) {
                post.comments.push(comment);
                post.save();

                comment = await comment.populate('user', 'name email');
                commentsMailer.newComment(comment);

                req.flash('success', 'Comment Added Successfully');
                res.redirect('/');
            } else {
                throw new Error('Failed to create comment');
            }
        } else {
            throw new Error('Post not found');
        }
    } catch (err) {
        req.flash('error', err);
        console.error('Error in adding comment:', err);
        res.status(500).send('Error in adding comment');
    }
};




module.exports.destroy = function (req, res) {
    Comment.findById(req.params.id)
        .then(comment => {
            if (comment.user == req.user.id) {
                let postId = comment.post;

                comment.deleteOne()
                    .then(() => {
                        req.flash('success', 'Comment Deleted Successfully');
                        return Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } })
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
            } else {
                return res.redirect('back');
            }
        })
        .catch(err => {
            console.error(err);
            return res.redirect('back');
        });
};
