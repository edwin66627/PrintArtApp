const Item = require('../../../server/models/item')
const User = require('../../../server/models/user')
const { ObjectId } = require('mongodb')
const faker = require('faker')
const jwt = require('jsonwebtoken')
require("dotenv").config({
    path: '../../../.env'
})

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

const userOneId = new ObjectId()
const userTwoId = new ObjectId()
const seedUsers = [
    {
        _id: userOneId,
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET).toString(),
        role: 'admin'
    },
    {
        _id: userTwoId,
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    }
]

const populateItems = async () => {
    await Item.deleteMany() //Deletes every single Item in DB if no criteria is passed to this method
    await Item.insertMany(seedItems)
}

const populateUsers = async () => {
    await User.deleteMany() //Deletes every single User in DB if no criteria is passed to this method
    //using mongoose save() to hash user passwords
    await new User(seedUsers[0]).save()
    await new User(seedUsers[1]).save()
}

module.exports = { seedItems, populateItems, seedUsers, populateUsers }