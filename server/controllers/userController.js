// Controller for User methods

const User = require('../models/user');

const { body, validationResult } = require('express-validator');
const async = require('async');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Return list of Users on GET
exports.user_list = (req, res, next) => {
  User.find()
    .sort([['username', 'ascending']])
    .exec((err, list_users) => {
      if (err) { return next(err) };
      res.json({ user_list: list_users });
    });
};

// Create new user on POST
exports.create_user = [
  // Validate and sanitize fields
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter a first name')
    .isLength({ max: 20 })
    .withMessage('First name must be 20 characters or less'),
  body('family_name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter a family name')
    .isLength({ max: 20 })
    .withMessage('Family name must be 20 characters or less'),
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters')
    .isLength({ max: 16 })
    .withMessage('Username must be 16 characters or less')
    .isAlphanumeric()
    .withMessage('Usernames may only contain alphanumeric characters'),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .isLength({ max: 100 })
    .withMessage('Password must not exceed 100 characters'),
  body('confirm_password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Password confirmation field must not be empty')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords must match'),

  // Process request after validation
  (req, res, next) => {
    async.parallel({
      user(callback) {
        User.findOne({ username: req.body.username }).exec(callback);
      },
    },
    (err, results) => {
      if (results.user) {
        return res.json({
          errors: ['Username already exists']
        });
      };

      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) { return next(err) };

        const errors = validationResult(req);

        const user = new User({
          first_name: req.body.first_name,
          family_name: req.body.family_name,
          username: req.body.username,
          password: hashedPassword,
          account_created: new Date(),
        });

        if (!errors.isEmpty()) {
          return res.json({
            errors: errors.array(),
          });
        };

        user.save((err) => {
          if (err) { return next(err) };
          res.json('Account successfully created.');
        });
      });
    });
  },
];