const Item = require('../../../server/models/item')
const { ObjectId } = require('mongodb')

const seedItems = [
    {
        "title": "Item1",
        "artist": "mongodb",
        "image": "dbimage2",
        "year": 2020,
        "price": 3000,
        "_id": new ObjectId()
    },
    {
        "title": "Item2",
        "artist": "mongodb",
        "image": "dbimage2",
        "year": 2020,
        "price": 3000,
        "_id": new ObjectId()
    }
]

const populateItems = async () => {
    await Item.deleteMany() //Deletes every single Item in DB if no criteria is passed to this method
    await Item.insertMany(seedItems)
}

module.exports = { seedItems, populateItems }