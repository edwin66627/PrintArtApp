const express = require("express");
const app = express();

app.use('/items', require('./routes/items'))

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/printart', {
  useNewUrlParser: true, useCreateIndex: true
});

const port = 8070;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
