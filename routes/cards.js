const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:id', deleteCard);

router.put('/:id/likes', addLikeCard);

router.delete('/:id/likes', deleteLikeCard);

module.exports = router;
