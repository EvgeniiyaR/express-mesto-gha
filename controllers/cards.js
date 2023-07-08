const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((card) => res.status(201).send(card))
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;
  const idCurrentUser = req.user._id;
  Card.findById(id)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Card Not Found'));
      }
      if (card.owner.toString() !== idCurrentUser) {
        return next(new ForbiddenError('The current user does not have the rights to delete this card'));
      }
      return card.deleteOne()
        .then(() => res.status(200).send({ message: `Card ${id} successfully delete` }))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

const likeCard = (req, res, next, objAction) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    objAction,
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Card Not Found'));
      }
      return res.status(200).send(card);
    })
    .catch((err) => next(err));
};

const addLikeCard = (req, res, next) => {
  likeCard(req, res, next, { $addToSet: { likes: req.user._id } });
};

const deleteLikeCard = (req, res, next) => {
  likeCard(req, res, next, { $pull: { likes: req.user._id } });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
};
