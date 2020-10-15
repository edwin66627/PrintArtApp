const User = require('../models/user')

//Create an User
exports.create = async (req, res) => {
    const { name, email, password } = req.body //any other info in the request is left out
    const user = new User({ name, email, password })
    try {
        const doc = await user.save()
        const token = await doc.generateAuthtoken()
        res
            .header("authorization", `Bearer ${token}`)
            .send({ user: doc })
    } catch (err) {
        res.status(400).send(err)
    }
}

exports.read = async (req, res) => {
    let token;
    //Extract token
    try {
        token = req.header("authorization").split(" ")[1]
    } catch (err) {
        return res.status(401).send({ message: 'Authorization token invalid' })
    }

    //Find user corresponding to the token
    try {
        const user = await User.findUserByToken(token)
        res.send({ user })
    } catch (err) {
        res.status(401).send(err)
    }
}