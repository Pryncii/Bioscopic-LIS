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
///test

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

describe('POST /addpatient', () => {
    it('should add a new patient successfully', async () => {
        const newPatient = {
            name: 'John Doe',
            sex: 'Male',
            birthday: '1990-01-01',
            age: 34,
            phoneNumber: '1234567890',
            email: 'john.doe@example.com',
            pwdID: 'PWD123',
            seniorID: 'SENIOR123',
            address: '123 Main St, City, Country',
            remarks: 'First-time visit',
        };

        const response = await request(app)
            .post('/addpatient')
            .send(newPatient)
            .set('Accept', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Patient added successfully');
        expect(response.body.patient).toHaveProperty('patientID', 1);
        expect(response.body.patient).toHaveProperty('name', newPatient.name);

        // Verify that the patient was saved in the database
        const savedPatient = await patientModel.findOne({ name: newPatient.name });
        expect(savedPatient).toBeTruthy();
        expect(savedPatient.patientID).toBe(1); // Since it's the first patient being added
    });
});

