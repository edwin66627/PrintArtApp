const Item = require('../../../server/models/item')

const seedItems = [
    {
        "title": "Item1",
        "artist": "mongodb",
        "image": "dbimage2",
        "year": 2020,
        "price": 3000
    },
    {
        "title": "Item2",
        "artist": "mongodb",
        "image": "dbimage2",
        "year": 2020,
        "price": 3000
    }
]

const populateItems = async () => {
    await Item.deleteMany() //Deletes every single Item in DB if no criteria is passed to this method
    await Item.insertMany(seedItems)
}

module.exports = { seedItems, populateItems }