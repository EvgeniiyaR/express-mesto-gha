const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const errorHandler = require('../middlewares/error-handler');
const { URL_PATTERN } = require('../utils/constants');
const NotFoundError = require('../errors/not-found-error');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    avatar: Joi.string().pattern(URL_PATTERN),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use(auth);

router.use('/users', userRoutes);

router.use('/cards', cardRoutes);

router.use(errors());

router.use((req, res, next) => next(new NotFoundError('Not Found')));

router.use(errorHandler);

module.exports = router;
