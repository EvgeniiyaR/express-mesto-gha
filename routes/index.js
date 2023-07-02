const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { NOT_FOUND } = require('../utils/errors');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signup', createUser);

router.post('/signin', login);

router.use(auth);

router.use('/users', userRoutes);

router.use('/cards', cardRoutes);

router.use((req, res, next) => {
  res.status(NOT_FOUND).send({ message: 'Not found' });

  next();
});

module.exports = router;
