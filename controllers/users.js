const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  UNAUTHORIZED,
  CONFLICT,
  FORBIDDEN,
} = require('../utils/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Server Error' }));
};

const getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'User Not Found' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid User ID' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Server Error' });
    });
};

const getCurrentUser = (req, res) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(UNAUTHORIZED).send({ message: 'Authorization required' });
      }
      return res.status(200).send(user);
    })
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Server Error' }));
};

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({ message: 'Email and password are required' });
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(CONFLICT).send({ message: 'The user already exists' });
      }

      return bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        }))
        .then((newUser) => res.status(201).send(newUser));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
      }
      return res.status(SERVER_ERROR).send({ message: 'Server Error' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'User Not Found' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
      }
      return res.status(SERVER_ERROR).send({ message: 'Server Error' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'User Not Found' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
      }
      return res.status(SERVER_ERROR).send({ message: 'Server Error' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(FORBIDDEN).send({ message: 'The user does not exist' });
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return res.status(FORBIDDEN).send({ message: 'Wrong email or password' });
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

          return res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          })
            .end();
        })
        .catch(() => res.status(SERVER_ERROR).send({ message: 'Server Error' }));
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
  getCurrentUser,
};
