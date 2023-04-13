// const router = require('express').Router();


// router.post('/test', function(req, res) {
//   res.json({ requestBody: req.body });
// });


// /*
// Add a test route in your backend/routes/api/index.js file
// that will test the setTokenCookie function 
// by getting the demo user and calling setTokenCookie. ↓↓
// */
// // GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'Demo-lition'
//     }
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

// /*
// add test route for restoreUser.
// this will test the restoreUser middleware 
// and check whether or not the req.user key 
// has been populated by the middleware properly. ↓↓
// */
// // GET /api/restore-user
// const { restoreUser } = require('../../utils/auth.js');

// router.use(restoreUser);

// router.get(
//   '/restore-user',
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// /*
// add a test route for requireAuth.
// If there is no session user, 
// the route will return an error. Otherwise it will 
// return the session user's information. ↓↓
// */
// // GET /api/require-auth
// const { requireAuth } = require('../../utils/auth.js');
// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );


// module.exports = router;

//// all the tests before clearing /////
//// after clearing tests ////

const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;