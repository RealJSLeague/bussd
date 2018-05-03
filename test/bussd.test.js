const request =require('supertest');
const app =require('../server/app');


describe('get the bus routes api', function(){
    it('gets data from the api',function(done){
        request(app).get('/api/routes')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200,done)
    })
});

describe('get the bus Stops api', function(){
    it('gets data from the api',function(done){
        request(app).get('/api/stops')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200,done)
    })
});


describe('get the bus vehicles api', function(){
    it('gets data from the api',function(done){
        request(app).get('/api/vehicle')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200,done)
    })
});


describe('get the bus trips api', function(){
    it('gets data from the api',function(done){
        request(app).get('/api/trips')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200,done)
    })
});

describe('get the bus routes api parameterized', function(){
    it('gets data from the api',function(done){
        request(app).get('/api/routes/110')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200,done)
    })
});

describe('get the bus stop times api parameterized', function(){
    it('gets data from the api',function(done){
        request(app).get('/api/stop-times/10025')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200,done)
    })
});


describe('get the bus stop times api parameterized', function(){
    it('gets data from the api',function(done){
        request(app).get('/api/stops/10001')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200,done)
    })
});

describe('get the bus stop times api parameterized', function(){
    it('gets data from the api',function(done){
        request(app).get('/api/trips/12712600')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200,done)
    })
});