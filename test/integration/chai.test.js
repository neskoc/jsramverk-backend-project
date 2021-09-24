/**
 * Chai integration tests.
 *
 * @author Nenad Cuturic
 */
/* jshint node: true */
/* jshint esversion: 8 */
"use strict";

process.env.NODE_ENV = 'test';

const auth = require("../../config/auth/auth.json");
const config = require("../../config/db/config.json");
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index.js');
var expect = chai.expect;
var assert = require('assert');
const mongoose = require('mongoose');
let dsn = `mongodb+srv://${config.username}:${config.password}@${config.cloud_db_url}`;
const docSchema = new mongoose.Schema({
    docName: String,
    content: String
});
const Testdocs = mongoose.model(config.testCollectionName, docSchema);
const docContent = "<p>Content</p>";

async function setup() {
    await mongoose.connect(dsn);
    // await Testdocs.connection.drop();
    // await Testdocs.connection.remove();
}

async function tearDown() {
    await mongoose.connect(dsn);
    await mongoose.connection.db.dropCollection(config.testCollectionName);
    // await Testdocs.connection.remove();
}


chai.should();

chai.use(chaiHttp);

describe('Reports', () => {
    before(() => {
        return new Promise((resolve) => {
            setup()
                .then(async () => {
                    const testDoc = {
                        docName: "UnitTest",
                        content: docContent
                    };
                    const unitTestDoc = new Testdocs(testDoc);

                    await unitTestDoc.save();
                }).catch(function(err) {
                    console.error(err);
                })
                .finally(async function() {
                    await mongoose.connection.close();
                    // await mongoose.disconnect();
                    resolve();
                });
        });
    });

    describe('GET /mongo', () => {
        it('200 Mongo API', (done) => {
            chai.request(server)
                .get("/mongo")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("object");
                    res.body.data.should.have.property("msg").equal("Mongo API");
                    expect(res).to.be.json;

                    done();
                });
        });
    });

    describe('GET /', () => {
        it('200 Hello World', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("object");
                    res.body.data.should.have.property("msg").equal("Hello World");
                    expect(res).to.be.json;

                    done();
                });
        });
    });

    describe('GET /error', () => {
        it("404 Not found", (done) => {
            chai.request(server)
                .get("/error")
                .end((err, res) => {
                    res.should.have.status(404);
                    expect(res).to.be.json;

                    done();
                });
        });
    });

    describe('GET /mongo/list', () => {
        it('403 API key is missing.', (done) => {
            chai.request(server)
                .get("/mongo/list")
                .end((err, res) => {
                    const msg = "API key is missing";

                    res.should.have.status(403);
                    res.body.should.be.an("object");
                    expect(res.body.errors[0]).to.have.property("title").equal(msg);
                    expect(res).to.be.json;

                    done();
                });
        });
    });

    describe('GET /mongo/list', () => {
        it('201 Fetching all docs', (done) => {
            chai.request(server)
                .get(`/mongo/list?api_key=${auth.api_key}`)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array").length(1);
                    expect(res).to.be.json;

                    done();
                });
        });
    });

    describe('POST /mongo/update', () => {
        it('403 Missing API key', (done) => {
            chai.request(server)
                .post(`/mongo/update`)
                .end((err, res) => {
                    const msg = "API key is missing";

                    res.should.have.status(403);
                    expect(res.body.errors[0]).to.have.property("title").equal(msg);
                    expect(res).to.be.json;

                    done();
                });
        });
    });

    describe('POST /mongo/update', () => {
        it('204 Updating doc', (done) => {
            let doc = {
                docName: "UnitTest",
                content: "<p>Udated content!</p>"
            };
            let body = {
                api_key: auth.api_key,
                doc: doc
            };

            chai.request(server)
                .post(`/mongo/update`)
                .send(body)
                .end((err, res) => {
                    res.should.have.status(204);
                    res.body.should.be.an("object");
                    assert.equal(Object.keys(res.body).length, 0);

                    done();
                });
        });
    });

    after(() => {
        return new Promise((resolve) => {
            tearDown()
                .catch(function(err) {
                    console.error(err);
                })
                .finally(async function() {
                    await mongoose.connection.close();
                    // await mongoose.disconnect();
                    resolve();
                });
        });
    });
});
