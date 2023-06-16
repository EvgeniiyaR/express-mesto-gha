const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { NOT_FOUND } = require('./utils/errors');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '648c9284c2df3b4964e875c8',
  };

  next();
});

app.use(routes);

app.use((req, res, next) => {
  res.status(NOT_FOUND).send({ message: 'Not found' });

  next();
});

app.listen(PORT);
