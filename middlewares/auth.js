const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../utils/errors');

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;

  if (!authorization) {
    return res
      .status(UNAUTHORIZED).send({ message: 'Authorization required' });
  }

  const token = authorization;
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res
      .status(UNAUTHORIZED).send({ message: 'Authorization required' });
  }

  req.user = payload;
  return next();
};
