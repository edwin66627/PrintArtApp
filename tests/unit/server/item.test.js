const expect = require('expect')
const app = require('../../../server')
const request = require('supertest')
const Item = require('../../../server/models/item')

/*Mocha life cycle hook to clear any pre-existing data in MongoDB so it doesn´t interfere with
  the unit test */
beforeEach(async () => {
    return Item.deleteMany() //Deletes every single Item in DB if no criteria is passed to this method
})


describe('POST /items', () => {
    it('Should create a new item', async () => {
        const body = { title: 'Test title' }
        const res = await request(app)
            .post('/items')
            .send(body)
            .expect(200);
        expect(res.body.item.title).toBe(body.title)
        const items = await Item.find()
        expect(items.length).toBe(1)
        expect(items[0].title).toBe(body.title)
    })
})