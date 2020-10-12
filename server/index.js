const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use('/items', require('./routes/items'))

mongoose.connect('mongodb://127.0.0.1:27017/printart', {
  useNewUrlParser: true, useCreateIndex: true
});

const port = 8070;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
