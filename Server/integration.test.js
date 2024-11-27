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

describe('Integration Test - Register User, Add Patient, Retrieve Patients, Filter Requests, and Update Request Status', () => {
    beforeEach(async () => {
        await userModel.deleteMany();
        await patientModel.deleteMany();
        await requestModel.deleteMany();
    });

    it('should register a user, add a patient, retrieve patient data, filter requests, and update request status', async () => {
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

        // Step 4: Create multiple patients and requests for filtering
        const patients = await patientModel.insertMany([
            { patientID: 1000, name: 'John Doe', sex: 'M', phoneNo: '1234567890' },
            { patientID: 1001, name: 'Jane Smith', sex: 'F', phoneNo: '0987654321' }
        ]);

        const requests = await requestModel.insertMany([
            { requestID: 1000, patientID: 1000, category: 'Hematology', test: 'Blood Test', status: 'Completed', payStatus: 'Paid', remarks: 'Blood test all good.' },
            { requestID: 1001, patientID: 1001, category: 'Serology', test: 'Dengue NS1', status: 'In Progress', payStatus: 'Unpaid', remarks: 'Should take blood test.'}
        ]);

        // Step 5: Test filtering by patient name
        const resName = await request(app).get('/requests').query({ search: 'Jane' });
        expect(resName.status).toBe(200);
        expect(resName.body).toHaveLength(1);
        expect(resName.body[0][0].patientID).toBe(1001);
        expect(resName.body[0][0].name).toBe('Jane Smith');

        // Test filtering by remark
        const resRemark = await request(app).get('/requests').query({ search: 'all good' });
        expect(resRemark.status).toBe(200);
        expect(resRemark.body).toHaveLength(1);
        expect(resRemark.body[0][0].patientID).toBe(1000);
        expect(resRemark.body[0][0].name).toBe('John Doe');

        // Test filtering by test type
        const resTest = await request(app).get('/requests').query({ search: 'dengue' });
        expect(resTest.status).toBe(200);
        expect(resTest.body).toHaveLength(1);
        expect(resTest.body[0][0].patientID).toBe(1001);
        expect(resTest.body[0][0].name).toBe('Jane Smith');
        
        // Step 6: Test retrieving all requests
        const resAll = await request(app).get('/requests');
        expect(resAll.status).toBe(200);
        expect(resAll.body.flat()).toHaveLength(2); // Two requests in total



        // Update the request status to 'Completed' and set dateEnd
        const updateResponse = await request(app)
            .put(`/api/requests/${requests[1].requestID}`)
            .send({
                status: "Completed",
                payStatus: "Paid",
                remarks: "Test completed",
            });

        expect(updateResponse.status).toBe(200);

        const updatedRequest = await requestModel.findOne({ requestID: requests[1].requestID });

        // Verify that the request status is updated and dateEnd is set
        expect(updatedRequest.status).toBe("Completed");
        expect(updatedRequest.payStatus).toBe("Paid");
        expect(updatedRequest.remarks).toBe("Test completed");
        expect(updatedRequest.dateEnd).not.toBeNull();  // Ensure the dateEnd is set
    });
});
