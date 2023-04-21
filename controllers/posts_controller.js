const Post = require('../models/post');
const Comment = require('../models/comment');

// module.exports.create = function(req, res){
//     Post.create({
//         content: req.body.content,
//         user: req.user._id
//     },
//     function(err, post){
//         if(err){
//             console.log('Error in creating post', err);
//             return;
//         }

//         return res.redirect('back');
//     });
// };

module.exports.create = function(req, res){
    Post.create({
        content: req.body.content,
        user: req.user._id
    })
    .then((post) => {
        return res.redirect('back');
    })
    .catch((err) => {
        console.log('Error in creating post', err);
        return;
    });
};


// module.exports.destroy = function(req,res){
//     Post.findById(req.params.id, function(err, post){
//         if(post.user == req.user.id){
//             post.remove();

//             Comment.deleteMany({post: req.params.id}, function(err){
//                 return res.redirect('back');
//             });
//         }else{
//             return res.redirect('back');
//         };
//     });
// }; 


module.exports.destroy = function(req, res) {
    Post.findById(req.params.id)
      .then(post => {
        if (post.user == req.user.id) {
          return post.deleteOne();
        } else {
          throw new Error("User is not authorized to delete this post");
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