const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { NOT_FOUND } = require('../utils/errors');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    avatar: Joi.string().required().domain(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);

router.use(errors());

router.post('/signin', login);

router.use(auth);

router.use('/users', userRoutes);

router.use('/cards', cardRoutes);

router.use((req, res, next) => {
  res.status(NOT_FOUND).send({ message: 'Not found' });

  next();
});

module.exports = router;
