// Routing module for HTTP requests

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Require controller modules
const user_controller = require('../controllers/userController');
const post_controller = require('../controllers/postController');
const like_controller = require('../controllers/likeController');
const request_controller = require('../controllers/requestController');


///// NON-SPECIFIC ROUTES ///// 

router.get('/', (req, res) => {
  res.json('Welcome to Odinbook!');
});

router.post('/', (req, res) => {
  if (req.body.token) {
    const decrypt = jwt.verify(req.body.token, process.env.SECRET_KEY);
    res.json({
      username: decrypt.username,
      name: `${decrypt.first_name} ${decrypt.family_name}`,
      id: decrypt.id,
    });
  } else {
    res.json('No current user.');
  };
});

router.post('/login', user_controller.login_user);


///// USER ROUTES /////

// GET list of users
router.get('/users', user_controller.user_list);

// POST create new user
router.post('/users', user_controller.create_user);

// GET details for a single user by ID
router.get('/users/id/:id', user_controller.userID_detail);

// GET details for a single user
router.get('/users/:username', user_controller.user_detail);


///// (USER-MADE) POST ROUTES /////

// GET list of posts
router.get('/posts', post_controller.post_list);

// Create new post on POST
router.post('/posts', post_controller.create_post);

// Return amount of likes on a post on GET
router.get('/posts/:id/likes', like_controller.get_likes);

// Create new like or removes an old one on a post on POST
router.post('/posts/:id', like_controller.add_like);


///// FRIEND REQUEST ROUTES /////

// Create new Friend Request on POST
router.post('/requests', request_controller.create_request);

module.exports = router;