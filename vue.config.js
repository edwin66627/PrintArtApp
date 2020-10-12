const path = require('path')

module.exports = {
    devServer: {
        port: process.env.PORT,
        proxy: `http://localhost:${process.env.SERVER_PORT}`
    }
}