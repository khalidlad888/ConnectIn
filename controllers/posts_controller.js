const Post = require('../models/post');
const Comment = require('../models/comment');
const postsMailer = require('../mailers/posts_mailer')

module.exports.create = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    if (req.xhr) {

      await post.populate('user', 'name email');
      postsMailer.newPost(post);

      return res.status(200).json({
        data: {
          post: post
        },
        message: 'Post Created!'
      })
    };

    req.flash('success', 'Post Created Successfully');
    return res.redirect('back');
  } catch (err) {
    req.flash('error', 'Error in Creating Post');
    console.log('Error in creating post', err);
    return;
  }
};


module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id)
    if (post.user == req.user.id) {
      post.deleteOne();
      await Comment.deleteMany({ post: req.params.id });

      if (req.xhr) {

        return res.status(200).json({
          data: {
            post_id: req.params.id
          },
          message: 'Post Deleted!'
        })
      }

      req.flash('success', 'Post and its Comments Deleted Successfully');
      return res.redirect("back");

    } else {
      req.flash('error', 'User is not authorized to delete this post');
      return res.redirect('back');
    }
  } catch (error) {
    console.error(error);
    return res.redirect("back");
  }
};