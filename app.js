require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const routes = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors({
  origin: 'https://mesto.evgeniiyar.nomoredomains.xyz',
  credentials: true,
}));

app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(routes);

app.listen(PORT);
