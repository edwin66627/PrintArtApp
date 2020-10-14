const User = require('../models/user')

//Create an User
exports.create = async (req, res) => {
    const user = new User(req.body)
    try {
        const doc = await user.save()
        const token = await doc.generateAuthtoken()
        res
            .header('authorization', `Bearer ${token}`)
            .send({ user: doc })
    } catch (err) {
        res.status(400).send(err)
    }
}
