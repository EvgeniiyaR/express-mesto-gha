const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/errors');

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
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid user' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Server Error' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
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
        return res.status(NOT_FOUND).send({ message: 'User not found' });
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
        return res.status(NOT_FOUND).send({ message: 'User not found' });
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

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
};
