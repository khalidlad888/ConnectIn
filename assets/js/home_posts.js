{
    //Method to submit the form data for new post using ajax
    let createPost = function () {
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function (data) {
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                    //call the create comment class
                    new PostComments(data.data.post._id);

                    new ToggleLike($(' .toggle-like-button', newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post Published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();

                }, error: function (error) {
                    console.log(error.responseText);
                }
            })
        })
    }

    //Method to create a post in DOM
    let newPostDom = function (post) {
        return $(`<li id="post-${post._id}">
                        <p>
                                <small>
                                    <a href="/posts/destroy/${post._id}" class="delete-post-button">X</a>
                                </small>

                                    ${post.content}
                                        <br>
                                        <small>
                                            ${post.user.name}
                                        </small>
                                        <br>
                                        <small>
                            
                                            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                                                0 Likes
                                            </a>
                            
                                        </small>
                        </p>
                        <div class="post-comments">
                            
                                <form action="/comments/create" id="post-${ post._id }-comments-form" method="POST">
                                    <input type="text" name="content" placeholder="Comment here..." required>
                                    <input type="hidden" name="post" value=" ${post._id}">
                                    <input type="submit" value="Add Comment">
                                </form>
                                
                                    <div class="post-comments-list">
                                        <ul id="post-comments-${post._id}">
                                            
                                        </ul>
                                    </div>
                        </div>
                    </li>`)
    }


    //Method to delete the post from DOM
    let deletePost = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`#post-${data.data.post_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();

                }, error: function (error) {
                    console.log(error.responseText);
                }
            })
        })
    }



    let convertPostsToAjax = function () {
        $('#posts-list-container>ul>li').each(function () {
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }


    convertPostsToAjax();
    createPost();
}