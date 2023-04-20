const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

/*
this middleware validates username, email, password.
this middleware is composed of 'check' and 'handleValidationErrors' middleware.
checks if req.body.email exists, is an email.
checks if req.body.username has min len 4, not email.
checks if req.body.password not empty, min len 6.
  if any of these 3 fail, return error in response.
*/
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
////////
  // check('firstName')
  //   .exists({ checkFalsy: true })
  //   .isAlpha()
  //   .withMessage('Please only use the alphabet, and it must not be empty.'),
  // check('lastName')
  //   .exists({ checkFalsy: true })
  //   .isAlpha()
  //   .withMessage('Please only use the alphabet, and it must not be empty.'),
///////
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];


// Sign up
router.post(
  '',
  validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);


module.exports = router;