const seed = require("./seed")
const mongoose = require("mongoose")
const path = require("path")
require("dotenv").config({
    path: '../.env'
})

//Two possible databases: One for app and the other for tes purposes
const dbName = process.env.NODE_ENV === 'test' ? 'printart_test' : 'printart'
mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`, {
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true
});

(async () => {
    try {
        await seed.users()
        process.exit(0)
    } catch (err) {
        process.exit(1)
    }
})();