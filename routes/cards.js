const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');
const { URL_PATTERN, ID_PATTERN } = require('../utils/constants');

const validationId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().min(24).max(24)
      .pattern(ID_PATTERN),
  }),
});

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    link: Joi.string().required().pattern(URL_PATTERN),
    name: Joi.string().required().min(2).max(30),
  }),
}), createCard);

router.delete('/:id', validationId, deleteCard);

router.put('/:id/likes', validationId, addLikeCard);

router.delete('/:id/likes', validationId, deleteLikeCard);

module.exports = router;
