const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

const validationId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().min(24).max(24).pattern(/^[a-z0-9]+$/),
  }),
});

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    link: Joi.string().required().pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/),
    name: Joi.string().required().min(2).max(30),
  }),
}), createCard);

router.delete('/:id', validationId, deleteCard);

router.put('/:id/likes', validationId, addLikeCard);

router.delete('/:id/likes', validationId, deleteLikeCard);

module.exports = router;
