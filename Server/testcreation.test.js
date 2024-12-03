const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, server } = require('./index'); // Your Express app
const { appdata } = require("./models/data");
const {
    hematologyModel,
    clinicalMicroscopyModel,
    chemistryModel,
    serologyModel,
    requestModel
} = appdata;

let mongoServer;

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    mongoServer = await MongoMemoryServer.create({
        binary: { version: '5.0.3' }  // Specify a version known to be available
    });
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Mute console.error
}, 50000);

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
    if (server) {  // Ensure server is defined
        server.close();
    }
    console.error.mockRestore();
});

describe('POST /api/requests', () => {
    it('should create a new request successfully', async () => {
        const requestData = {
            tests: {
                "CBC": "Hematology",
                "FBS": "Chemistry"
            },
            patientID: '12345',
            payment: 'Paid'
        };

        const response = await request(app)
            .post('/api/requests')
            .send(requestData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Requests created successfully with latest ID');
        expect(response.body.newReqId).toBeDefined();

        // Verify that the request was created in the database
        const createdRequest = await requestModel.findOne({ patientID: requestData.patientID });
        expect(createdRequest).toBeTruthy();
        expect(createdRequest.category).toBe('Hematology');
        expect(createdRequest.test).toContain('CBC');
    });

    it('should create a new request successfully', async () => {
        const requestData = {
            tests: {
                "Urinalysis": "Clinical Microscopy",
                "HbsAg": "Serology",
            },
            patientID: '12344',
            payment: 'Paid'
        };

        const response = await request(app)
            .post('/api/requests')
            .send(requestData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Requests created successfully with latest ID');
        expect(response.body.newReqId).toBeDefined();

        // Verify that the request was created in the database
        const createdRequest = await requestModel.findOne({ patientID: requestData.patientID });
        expect(createdRequest).toBeTruthy();
        expect(createdRequest.category).toBe('Clinical Microscopy');
        expect(createdRequest.test).toContain('Urinalysis');
    });


    it('should handle database errors gracefully', async () => {
        const requestData = {
            tests: {
                "CBC": "Hematology"
            },
            patientID: '12345',
            payment: 'Paid'
        };

        // Simulate a database failure by mocking the save method
        jest.spyOn(requestModel.prototype, 'save').mockRejectedValueOnce(new Error('Database error'));

        const response = await request(app)
            .post('/api/requests')
            .send(requestData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Failed to create request');
    });
});
