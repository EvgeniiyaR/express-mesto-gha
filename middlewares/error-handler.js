const { SERVER_ERROR } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(SERVER_ERROR).send({ message: 'Server Error' });
    next();
  }
};

module.exports = errorHandler;
