const Card = require('../models/card');
const ServerError = require('../errors/server-error');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      next(new ServerError('Server Error'));
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      }
      next(new ServerError('Server Error'));
    });
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;
  const idCurrentUser = req.user._id;
  Card.findById(id)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Card Not Found'));
      }
      if (card.owner.toString() !== idCurrentUser) {
        next(new ForbiddenError('The current user does not have the rights to delete this card'));
      }
      return Card.findByIdAndRemove(id)
        .then((cardDel) => res.status(200).send(cardDel));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid Card ID'));
      }
      next(new ServerError('Server Error'));
    });
};

const addLikeCard = (req, res, next) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Card Not Found'));
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid Card ID'));
      }
      next(new ServerError('Server Error'));
    });
};

const deleteLikeCard = (req, res, next) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Card Not Found'));
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid Card ID'));
      }
      next(new ServerError('Server Error'));
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
};
