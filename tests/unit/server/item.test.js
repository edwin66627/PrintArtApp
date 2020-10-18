const expect = require('expect')
const app = require('../../../server')
const request = require('supertest')
const Item = require('../../../server/models/item')
const { seedItems, populateItems, seedUsers } = require('./seed')
const { ObjectId } = require('mongodb')

/*Mocha life cycle hook to clear any pre-existing data in MongoDB so it doesn´t interfere with
  the unit test */
beforeEach(populateItems)


describe("POST /items", () => {
    it('Should create a new item', async () => {
        const body = { title: 'Test title' }
        const res = await request(app)
            .post('/items')
            .set("authorization", `Bearer ${seedUsers[0].token}`)
            .send(body)
            .expect(200);
        expect(res.body.item.title).toBe(body.title)
        const items = await Item.find()
        expect(items.length).toBe(seedItems.length + 1)
        expect(items[seedItems.length].title).toBe(body.title)
    });
    it('should not create an item with invalid data', async () => {
        await request(app)
            .post('/items')
            .set("authorization", `Bearer ${seedUsers[0].token}`)
            .send({})
            .expect(400);
        const items = await Item.find()
        expect(items.length).toBe(seedItems.length)
    });
});

describe('GET /items', () => {
    it('Should get all items', async () => {
        const res = await request(app)
            .get('/items')
            .expect(200)
        expect(res.body.items.length).toBe(seedItems.length)
    })
})

describe('GET /items/:id', () => {
    it('Should get item doc', async () => {
        const res = await request(app)
            .get(`/items/${seedItems[0]._id.toHexString()}`)
            .expect(200)
        expect(res.body.item.title).toBe(seedItems[0].title)
    });
    it('should return 404 if item not found', async () => {
        await request(app)
            .get(`/items/${new ObjectId().toHexString()}`)
            .expect(404)
    });
    it('should return 404 for invalid id', async () => {
        await request(app)
            .get('/items/123')
            .expect(404)
    });
});