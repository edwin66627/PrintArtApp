const express = require("express");
const app = express();
require('dotenv').config()

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use('/items', require('./routes/items'))
app.use('/users', require('./routes/users'))

//Two possible databases: One for app and the other for tes purposes
const dbName = process.env.NODE_ENV === 'test' ? 'printart_test' : 'printart'
mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`, {
  useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true
});

const port = process.env.SERVER_PORT;
if (process.env.SERVER_PORT != 'test') {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

module.exports = app;