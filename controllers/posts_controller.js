const Post = require('../models/post');
const Comment = require('../models/comment');
const postsMailer = require('../mailers/posts_mailer')

module.exports.create = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    if(post){
      await post.populate('user', 'name email');
      postsMailer.newPost(post);
    }

    req.flash('success', 'Post Created Successfully');
    return res.redirect('back');
  } catch (err) {
    req.flash('error', 'Error in Creating Post');
    console.log('Error in creating post', err);
    return;
  }
};


module.exports.destroy = function (req, res) {
  Post.findById(req.params.id)
    .then(post => {
      if (post.user == req.user.id) {
        req.flash('success', 'Post and its Comments Deleted Successfully');
        return post.deleteOne();
      } else {
        req.flash('error', 'User is not authorized to delete this post');
        // throw new Error("User is not authorized to delete this post");
      }
    })
    .then(() => {
      return Comment.deleteMany({ post: req.params.id });
    })
    .then(() => {
      return res.redirect("back");
    })
    .catch(err => {
      console.error(err);
      return res.redirect("back");
    });
};  