const Item = require('../models/item')
const { ObjectId } = require('mongodb')

//Get all items
exports.list = async (req, res) => {
    try {
        const items = await Item.find()
        res.send({ items })
    } catch (err) {
        res.status(500).send()
    }
}

//Create an Item
exports.create = async (req, res) => {
    const { title, artist, year, price, image } = req.body //any other info in the request is left out
    const item = new Item({ title, artist, year, price, image })
    try {
        const doc = await item.save()
        res.send({ item: doc })
    } catch (err) {
        res.status(400).send(err)

    }
}

//Get an Item
exports.read = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(404).send()
    }
    try {
        const item = await Item.findById(req.params.id)
        if (!item) {
            return res.status(404).send()
        }

        res.send({ item })
    } catch (err) {
        res.status(500).send()
    }
}