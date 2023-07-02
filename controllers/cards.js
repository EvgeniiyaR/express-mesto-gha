const Card = require('../models/card');
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICT,
} = require('../utils/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Server Error' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
      }
      return res.status(SERVER_ERROR).send({ message: 'Server Error' });
    });
};

const deleteCard = (req, res) => {
  const { id } = req.params;
  const idCurrentUser = req.user._id;
  Card.findById(id)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Card Not Found' });
      }
      if (card.owner.toString() !== idCurrentUser) {
        return res.status(CONFLICT).send({ message: 'The current user does not have the rights to delete this card' });
      }
      return Card.findByIdAndRemove(id)
        .then((cardDel) => res.status(200).send(cardDel));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid Card ID' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Server Error' });
    });
};

const addLikeCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Card Not Found' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid Card ID' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Server Error' });
    });
};

const deleteLikeCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Card Not Found' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid Card ID' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Server Error' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
};
