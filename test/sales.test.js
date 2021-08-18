'use strict'

process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const {SaleController} = require('../src/Controllers/Sale');
const { Sale } = require('../src/Model/index').Models;

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require(' ../app');
const should = chai.should();


chai.use(chaiHttp);

let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMGE2YTQ5NmNjNzE3MDQ5Y2NkMTk5YSIsImlzcyI6IlpzZmV4YUwxMGxrcUR0bnJ1TEl4Rm8xaTNqeHFTeldtWHp4MWxsZnBxTnEzemFzTHFHIiwiZXhwIjoxNjMzMjU2NTIxLCJpYXQiOjE2MjgwNzI1MjF9.C2rNAowC9LnZc6Jr25GkJ_ErxG2I_VMsxPcLv9Rq9-w";

describe('Sale', function (done) {
    beforeEach(function (done) {
        Sale.remove({}, function (err) {
            return done()
        })

        let user = {
            'username': 'test3',
            'password': 'test1234'
        }

        chai.request(app).post('/api/v1/auth/login').send(user).end(function (err, res) {
            done();
        })
    })
})

describe('GET /sales/all', function () {
    it('should get all sales', function (done) {
        return chai.request(app).get('/api/v1/sales/all').end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            return done();
        })
    })
})

describe('POST /sales/add', function () {
    it('should add a sale', function (done) {
        let election = {
            location: 'Ibadan',
            customerName: 'Yemi Ojo',
            amountPaid: 1342213,
            volumeDispensed: 242
        }
        return chai.request(app).post('/api/v1/sales/add').end(function (err, res) {
            res.should.have.status(201);
            return done();
        })
    })
    it('should error out if field is missing', function (done) {
        return chai.request(app).post('/api/v1/sales/add').end(function (err, res) {
            res.should.have.status(400);
            return done();
        })
    })
})