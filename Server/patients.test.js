const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const {app, server} = require('./index'); // Your Express app
const { appdata } = require("./models/data");
const {
    userModel,
    patientModel,
    requestModel,
    hematologyModel,
    clinicalMicroscopyModel,
    chemistryModel,
    serologyModel,
    allTestModel
} = appdata;

let mongoServer;

beforeAll(async () => {
    process.env.NODE_ENV = 'test'; 
    mongoServer = await MongoMemoryServer.create({
        binary: { version: '5.0.3' }  // Specify a version known to be available
    });
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
}, 50000);

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
    if (server) {  // Ensure server is defined
        server.close();
    }
});

describe('GET /patients', () => {
    beforeEach(async () => {
        // Clear previous data
        await patientModel.deleteMany();
        await requestModel.deleteMany();
    });

    it('should return patients with the most recent valid dateStart', async () => {
        // Mock patients and requests data
        await patientModel.insertMany([
            { patientID: 1, name: 'Patient A', remarks: 'Remark A' },
            { patientID: 2, name: 'Patient B', remarks: 'Remark B' }
        ]);

        await requestModel.insertMany([
            { patientID: 1, dateStart: '2024-01-01' },
            { patientID: 1, dateStart: '2024-01-15' }, // Latest valid date for Patient A
            { patientID: 1, dateStart: null },        // Invalid date
            { patientID: 2, dateStart: null },
            { patientID: 2, dateStart: '2024-02-01' }  // Latest valid date for Patient B
        ]);

        const response = await request(app).get('/patients');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            [
                { patientID: 1, name: 'Patient A', latestDate: 'January 15, 2024', remarks: 'Remark A' },
                { patientID: 2, name: 'Patient B', latestDate: 'February 1, 2024', remarks: 'Remark B' }
            ]
        ]);
    });

    it('should handle patients with only "N/A" or invalid dates by setting latestDate to "N/A"', async () => {
        await patientModel.create({ patientID: 3, name: 'Patient C', remarks: 'Remark C' });
        await requestModel.create({ patientID: 3, dateStart: null });

        const response = await request(app).get('/patients');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            [
                { patientID: 3, name: 'Patient C', latestDate: 'N/A', remarks: 'Remark C' }
            ]
        ]);
    });

    it('should handle multiple pages of results if there are more than 5 patients', async () => {
        const patients = Array.from({ length: 6 }, (_, i) => ({
            patientID: i + 1,
            name: `Patient ${i + 1}`,
            remarks: `Remark ${i + 1}`
        }));

        await patientModel.insertMany(patients);
        const requests = Array.from({ length: 6 }, (_, i) => ({
            patientID: i + 1,
            dateStart: `2024-01-${i + 10}` // Each patient has a unique date
        }));

        await requestModel.insertMany(requests);

        const response = await request(app).get('/patients');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2); // Expecting 2 pages
        expect(response.body[0].length).toBe(5); // First page with 5 entries
        expect(response.body[1].length).toBe(1); // Second page with 1 entry
    });
});
