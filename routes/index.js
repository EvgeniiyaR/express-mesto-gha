const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { createUser, login, deleteCookies } = require('../controllers/users');
const auth = require('../middlewares/auth');
const errorHandler = require('../middlewares/error-handler');
const { URL_PATTERN } = require('../utils/constants');
const NotFoundError = require('../errors/not-found-error');
const { requestLogger, errorLogger } = require('../middlewares/logger');

router.use(requestLogger);

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

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

router.use(errorLogger);

router.use('/logout', deleteCookies);

router.use(errors());

router.use((req, res, next) => next(new NotFoundError('Not Found')));

router.use(errorHandler);

module.exports = router;
