const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){

    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });

    return res.json(200, {
        message: 'List of posts v2',
        posts: posts
    })
};


module.exports.destroy = function (req, res) {
    Post.findById(req.params.id)
      .then(post => {
        if (post.user == req.user.id) {
          return post.deleteOne();
        } else {
          return res.json(401, {
            message: 'You cannot delete this post!'
          })
        }
      })
      .then(() => {
        return Comment.deleteMany({ post: req.params.id });
      })
      .then(() => {
        return res.json(200, {
            message: 'Post and its comments deleted'
        });
      })
      .catch(err => {
        return res.json(500, {
            message: 'Internal server error'
        })
      });
  };  