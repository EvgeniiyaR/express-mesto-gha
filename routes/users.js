const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:id', getUser);

router.post('/signup', createUser);

router.post('/signin', login);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
