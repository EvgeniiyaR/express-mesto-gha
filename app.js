const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => console.log('connected to db'));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.status(404).send({ message: 'Not found' });

  next();
});

app.use((req, res, next) => {
  req.user = {
    _id: '648c9284c2df3b4964e875c8', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
