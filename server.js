require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db/db');

const saleItems = require('./routes/saleItems');
const apiKeys = require('./routes/apiKeys');
const currency = require('./routes/currency');
const activities = require('./routes/activities');
var sliderCaptcha = require('@slider-captcha/core');

const PORT = process.env.PORT || 8000;

db.connect(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});

const app = express();
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());
app.get('/', (_, res) => {
  res.send('update');
});

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/captcha/create', function (req, res) {
  console.log('req.session', req.session)
  sliderCaptcha.create()
    .then(function ({data, solution}) {
      console.log('data', data)
      req.session.captcha = solution;
      req.session.save();
      res.status(200).send(data);
    });
});

app.post('/captcha/verify', function (req, res) {
  sliderCaptcha.verify(req.session.captcha, req.body)
    .then(function (verification) {
      if (verification.result === 'success') {
        req.session.token = verification.token;
        req.session.save();
      }
      res.status(200).send(verification);
    });
});
