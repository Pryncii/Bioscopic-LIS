const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, server } = require('./index'); // Your Express app
const { appdata } = require("./models/data");
const {
    hematologyModel,
    clinicalMicroscopyModel,
    chemistryModel,
    serologyModel
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

describe('POST /testvalues', () => {
    it('should update hematology test values successfully', async () => {
        const testData = {
            requestID: '12345',
            category: 'Hematology',
            esr: 100,
            bloodTypeWithRh: 100,
            clottingTime: 10000, // Example field that will be updated
            bleedingTime: 10000
        };

        // Create a mock document in the database before running the test
        await hematologyModel.create({
            requestID: '12345',
            esr: -1,
            bloodTypeWithRh: -1,
            clottingTime: -1, // Example field that will be updated
            bleedingTime: -1
        });

        const response = await request(app)
            .post('/testvalues')
            .send(testData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Test values updated successfully!');

        // Verify that the document was updated in the database
        const updatedRequest = await hematologyModel.findOne({ requestID: testData.requestID });
        expect(updatedRequest).toBeTruthy();
        expect(updatedRequest.clottingTime).toBe(testData.clottingTime);
        expect(updatedRequest.esr).toBe(testData.esr);
        expect(updatedRequest.bleedingTime).toBe(testData.bleedingTime); // Verifying the update
        expect(updatedRequest.bloodTypeWithRh).toBe(testData.bloodTypeWithRh);
    });

    it('should update chemistry test values successfully', async () => {
        const testData = {
            requestID: '12345',
            category: 'Chemistry',
            fbs: 100,
            rbs: 100
        };

        // Create a mock document in the database before running the test
        await chemistryModel.create({
            requestID: '12345',
            fbs: -1,
            rbs: -1
        });

        const response = await request(app)
            .post('/testvalues')
            .send(testData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Test values updated successfully!');

        // Verify that the document was updated in the database
        const updatedRequest = await chemistryModel.findOne({ requestID: testData.requestID });
        expect(updatedRequest).toBeTruthy();
        expect(updatedRequest.fbs).toBe(testData.fbs); // Verifying the update
        expect(updatedRequest.rbs).toBe(testData.rbs);
    });


    it('should handle server errors gracefully', async () => {
        const testData = {
            requestID: '12345',
            category: 'Hematology',
            fieldToUpdate: 'newValue', // Example field that will be updated
        };

        // Simulate a database failure by mocking the model's findOneAndUpdate method
        jest.spyOn(hematologyModel, 'findOneAndUpdate').mockRejectedValueOnce(new Error('Database error'));

        const response = await request(app)
            .post('/testvalues')
            .send(testData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal server error');
    });
});
