const Post = require('../model/post');

exports.createPost = (req,res,next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({ 
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    //post.save();   // automatically save the data in the DB but the data is stored in the form of collections 
    post.save().then(createdPost => {
        res.status(201).json({
            message: "Post added successfully",
            //postId: createdPost._id
            post: {
                ...createdPost,  // spread operator to compy all the properties of the createdPost
                id: createdPost._id
            }
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Creating a post failed!"
        });
    });
};

exports.updatePost = (req,res,next) => {
    let imagePath = req.body.imagePath;
    if(req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post )
    .then(result => {
        //console.log(result);
        if(result.n > 0) {
            res.status(200).json({
                message: "Update Successful"
            });
        } 
        else {
            res.status(401).json({
                message: 'Not Authorized'
            });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Couldn't update post"
        }); 
    });
};

exports.getPosts = (req,res,next) => {
    const pageSize = +req.query.pagesize; // + converts the url coming as a text to numbers
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage) { // for fetching specified number of posts on a page
        postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize); // to limit the amount of data to be dislayed on the page
        // skip means we will not retrieve all posts we find but we will skip the first n posts
    }
    postQuery.then(documents => {  // for fetching all the posts
        fetchedPosts = documents;        
        return Post.count();
    })
    .then(count => {
        res.status(200).json({
            message: 'Posts fetched successfully',
            posts: fetchedPosts,
            maxPosts: count
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching posts failed!"
        });
    });
};

exports.getPost = (req,res,next) => {    //after refreshing in the edit mode the data should remain on the page
    Post.findById(req.params.id).then(post => {
        if(post) {
            res.status(200).json(post);
        }
        else {
            res.status(404).json({message: 'Post not Found'});
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching post failed!"
        });
    });
};

exports.deletePost = (req,res,next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
        //console.log(result);
        if(result.n > 0) {
            res.status(200).json({message: 'Post Deleted'});
        } 
        else {
            res.status(401).json({message: 'Not Authorized'});
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching posts failed!"
        });
    });
};