module.exports.profile = function (req, res) {
    // return res.end('<h1> User Profile </h1>');

    return res.render('profile', {
        title: "Profile"
    });
};

module.exports.chats = function (req, res) {
    return res.end('<h1> User Chats</h1>');
};