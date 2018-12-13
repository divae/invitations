 const request = require('supertest');
 const app = require('../src/app');

 const req = request(app);


 describe('Integration test example', function() {
    it('get /', function(done) {
        req
            .get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(JSON.stringify({ "hi": "world" }))
            .expect(200, done);
    });
 });