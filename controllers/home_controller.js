const Post = require('../models/post');
const User = require('../models/user');


module.exports.home = async function(req, res){

    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } },
            populate: [
              { path: 'user' },
              { path: 'likes' }
            ]
          })
        .populate('likes');
        // console.log(posts);
        // posts.forEach((e)=> {
        //     e.comments.forEach((f)=>{
        //         console.log(f.user)
        //     });
        // });

    
        let users = await User.find({});

        return res.render('home', {
            title: " | Home",
            posts:  posts,
            all_users: users
        });

    }catch(err){
        console.log('Error', err);
        return;
    }
   
};