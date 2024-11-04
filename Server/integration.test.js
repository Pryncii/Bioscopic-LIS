const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, server } = require('./index');
const { appdata } = require("./models/data");
const { userModel, patientModel, requestModel } = appdata;

let mongoServer;

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    mongoServer = await MongoMemoryServer.create({ binary: { version: '5.0.3' } });
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
}, 50000);

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
    if (server) {
        server.close();
    }
});

describe('Integration Test - Register User, Add Patient, and Retrieve Patients', () => {
    beforeEach(async () => {
        await userModel.deleteMany();
        await patientModel.deleteMany();
        await requestModel.deleteMany();
    });

    it('should register a user, add a patient, and retrieve the patient data successfully', async () => {
        // Step 1: Register a new user
        const newUser = {
            firstName: 'John',
            middleName: 'Doe',
            lastName: 'Smith',
            sex: 'M',
            phoneNumber: '09123456789',
            username: 'johnsmith',
            email: 'johnsmith@example.com',
            password: 'password',
            prc: ''
        };
        const registerResponse = await request(app).post('/register').send(newUser);
        expect(registerResponse.status).toBe(201);
        expect(registerResponse.body.message).toBe('User registered successfully!');

        // Step 2: Add a new patient associated with the user
        const newPatient = {
            name: 'Jane Doe',
            sex: 'Female',
            birthday: '1995-05-15',
            age: 29,
            phoneNumber: '0987654321',
            email: 'jane.doe@example.com',
            pwdID: 'PWD456',
            seniorID: 'SENIOR456',
            address: '456 Elm St, City, Country',
            remarks: 'Follow-up visit',
        };
        const addPatientResponse = await request(app).post('/addpatient').send(newPatient);
        expect(addPatientResponse.status).toBe(201);
        expect(addPatientResponse.body.message).toBe('Patient added successfully');
        expect(addPatientResponse.body.patient).toHaveProperty('name', newPatient.name);

        // Step 3: Retrieve patients to confirm the added patient appears in the results
        const patientsResponse = await request(app).get('/patients');
        expect(patientsResponse.status).toBe(200);
        expect(patientsResponse.body[0]).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: newPatient.name,
                    remarks: newPatient.remarks,
                })
            ])
        );
    });
});
