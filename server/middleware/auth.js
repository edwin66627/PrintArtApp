const User = require("../models/user")

//Find user, attach it to the request and do error handling
module.exports = async (req, res) => {
    let token;
    //Extract token
    try {
        token = req.header("authorization").split(" ")[1]
    } catch (err) {
        return res.status(401).send({ message: 'Authorization token invalid' })
    }

    //Find user corresponding to the token
    try {
        req.user = await User.findUserByToken(token)
        req.token = token
        next()
    } catch (err) {
        res.status(401).send(err)
    }
}