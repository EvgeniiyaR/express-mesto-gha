const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
};

const findByIdAndGetUser = (res, next, id, message) => {
  User.findById(id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(message));
      }
      return res.status(200).send(user);
    })
    .catch((err) => next(err));
};

const getUser = (req, res, next) => {
  const { id } = req.params;
  findByIdAndGetUser(res, next, id, 'User Not Found');
};

const getCurrentUser = (req, res, next) => {
  const id = req.user._id;
  findByIdAndGetUser(res, next, id, 'Not Found');
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((newUser) => res.status(201).send(
      {
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
        _id: newUser._id,
      },
    ))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('The user already exists'));
      }
      return next(err);
    });
};

const findByIdAndUpdateUser = (req, res, next, info) => {
  User.findByIdAndUpdate(
    req.user._id,
    info,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Not Found'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => next(err));
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  findByIdAndUpdateUser(req, res, next, { name, about });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  findByIdAndUpdateUser(req, res, next, { avatar });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('The user does not exist'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new UnauthorizedError('Wrong email or password'));
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key', { expiresIn: '7d' });
          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          });

          return res.status(200).send({ message: `User ${user.email} successfully logged in` });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

const deleteCookies = (req, res) => {
  res.status(200).clearCookie('jwt').send({ message: 'Cookies removed' });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
  getCurrentUser,
  deleteCookies,
};
