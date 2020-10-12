const expect = require('expect')
const app = require('../../../server')
const request = require('supertest')
const Item = require('../../../server/models/item')
const { seedItems, populateItems } = require('./seed')

/*Mocha life cycle hook to clear any pre-existing data in MongoDB so it doesn´t interfere with
  the unit test */
beforeEach(populateItems)


describe('POST /items', () => {
    it('Should create a new item', async () => {
        const body = { title: 'Test title' }
        const res = await request(app)
            .post('/items')
            .send(body)
            .expect(200);
        expect(res.body.item.title).toBe(body.title)
        const items = await Item.find()
        expect(items.length).toBe(seedItems.length + 1)
        expect(items[seedItems.length].title).toBe(body.title)
    })
})

describe('GET /items', () => {
    it('Should get all items', async () => {
        const res = await request(app)
            .get('/items')
            .expect(200)
        expect(res.body.items.length).toBe(seedItems.length)
    })
})