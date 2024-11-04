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

describe('POST /addpatient', () => {
    beforeEach(async () => {
        await patientModel.deleteMany();
    });

    it('should add a new patient successfully even without birthday, address, PWD ID, and SeniorID', async () => {
        const newPatient = {
            patientID: 1000,
            name: 'Doe, John, Alec',
            sex: 'M',
            birthday: null,
            age: 40,
            phoneNo: "09123456789",
            email: "johndoe@gmail.com",
            pwdID: "",
            seniorID: "",
            address: "",
            remarks: "",
        };

        const response = await request(app).post('/addpatient').send(newPatient);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Patient added successfully');
    });

    it('should be successful if age and birthday match', async () => {
        const newPatient = {
            patientID: 1000,
            name: 'Doe, John, Alec',
            sex: 'M',
            birthday: 2003-12-27,
            age: 20,
            phoneNo: "09123456789",
            email: "johndoe@gmail.com",
            pwdID: "",
            seniorID: "",
            address: "",
            remarks: "",
            message: "",
        };

        const response = await request(app).post('/addpatient').send(newPatient);
        expect(response.body.message).toBe('Patient added successfully');
        expect(response.status).toBe(201);
    });

    it('should return an error if age and birthday does not match', async () => {
        const newPatient = {
            patientID: 1000,
            name: 'Doe, John, Alec',
            sex: 'M',
            birthday: 2003-12-27,
            age: 40,
            phoneNo: "09123456789",
            email: "johndoe@gmail.com",
            pwdID: "",
            seniorID: "",
            address: "",
            remarks: "",
            message: "error",
        };

        const response = await request(app).post('/addpatient').send(newPatient);
        expect(response.body.message).toBe('Failed to add patient. Please try again');
        expect(response.status).toBe(400);
    });

});

