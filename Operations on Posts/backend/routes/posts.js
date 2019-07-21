const express = require("express"); 

const PostController = require("../controllers/post");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, PostController.createPost);

router.put("/:id", checkAuth, extractFile, PostController.updatePost);

//for fetching all the posts
router.get("", PostController.getPosts);

//for fetching posts with an Id
router.get("/:id", PostController.getPost);

router.delete("/:id", checkAuth, PostController.deletePost); 

module.exports = router;