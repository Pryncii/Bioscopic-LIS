const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, server } = require('./index');
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
    if (mongoose.connection.readyState === 0) { // 0 means disconnected
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
  });

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
    if (server) {
        server.close();
    }
});

describe('GET /requests', () => {
    beforeEach(async () => {
        await appdata.patientModel.deleteMany();
        await appdata.requestModel.deleteMany();
    });

    it('should return filtered requests for multiple patients', async () => {
        // Create multiple patients
        const patients = await appdata.patientModel.insertMany([
            { patientID: 1000, name: 'John Doe', sex: 'M', phoneNo: '1234567890' },
            { patientID: 1001, name: 'Jane Smith', sex: 'F', phoneNo: '0987654321' }
        ]);

        // Create multiple requests
        const requests = await appdata.requestModel.insertMany([
            { requestID: 1000, patientID: 1000, category: 'Hematology', test: 'Blood Test', status: 'Completed', payStatus: 'Paid', remarks: 'Blood test all good.' },
            { requestID: 1001, patientID: 1001, category: 'Serology', test: 'Dengue NS1', status: 'In Progress', payStatus: 'Unpaid', remarks: 'Should take blood test.'}
        ]);

        // Test filtering by patient name
        const resName = await request(app).get('/requests').query({ search: 'Jane' });
        expect(resName.status).toBe(200);
        expect(resName.body).toHaveLength(1); // Only one request for Jane Smith
        expect(resName.body[0][0].patientID).toBe(1001);
        expect(resName.body[0][0].name).toBe('Jane Smith');

        const resRemark = await request(app).get('/requests').query({ search: 'all good' });
        expect(resRemark.status).toBe(200);
        expect(resRemark.body).toHaveLength(1); // Only one request for remark with 'all good'
        expect(resRemark.body[0][0].patientID).toBe(1000);
        expect(resRemark.body[0][0].name).toBe('John Doe');

        const resTest = await request(app).get('/requests').query({ search: 'dengue' });
        expect(resTest.status).toBe(200);
        expect(resTest.body).toHaveLength(1); // Only one request for test with 'dengue'
        expect(resTest.body[0][0].patientID).toBe(1001);
        expect(resTest.body[0][0].name).toBe('Jane Smith');
        
        // Test retrieving all requests
        const resAll = await request(app).get('/requests');
        expect(resAll.status).toBe(200);
        expect(resAll.body.flat()).toHaveLength(2); // Two requests in total
    });

    it('should return requests filtered by category and status', async () => {
        // Insert more requests for filtering by category and status
        await appdata.requestModel.insertMany([
            { requestID: 1002, patientID: 1000, category: 'Chemistry', test: 'SGPT', status: 'In Progress', payStatus: 'Paid' },
            { requestID: 1003, patientID: 1001, category: 'Clinical Microscopy', test: 'Urinalysis', status: 'Completed', payStatus: 'Unpaid' }
        ]);

        // Test filtering by category "Chemistry"
        const resCategory = await request(app).get('/requests').query({ category: 'Chemistry' });
        expect(resCategory.status).toBe(200);
        expect(resCategory.body[0][0].patientID).toBe(1000);
        expect(resCategory.body[0][0].category).toBe('Chemistry');

        // Test filtering by category "Urinalysis"
        const resTest = await request(app).get('/requests').query({ test: 'Urinalysis' });
        expect(resTest.status).toBe(200);
        expect(resTest.body[0][0].patientID).toBe(1001);
        expect(resTest.body[0][0].tests).toBe('Urinalysis');

        // Test filtering by status "Completed"
        const resStatus = await request(app).get('/requests').query({ status: 'Completed' });
        expect(resStatus.status).toBe(200);
        expect(resStatus.body[0][0].patientID).toBe(1001);
        expect(resStatus.body[0][0].requestStatus).toBe('Completed');
    });

    // Test with only lower bound on dateStart
    it('should filter requests with dateStart greater than or equal to lowerdatest', async () => {

        await appdata.requestModel.insertMany([
            { requestID: 1000, patientID: 1000, category: 'Hematology', status: 'Completed', dateStart: new Date('2023-10-01'), dateEnd: new Date('2023-10-05') },
            { requestID: 1001, patientID: 1001, category: 'Chemistry', status: 'In Progress', dateStart: new Date('2022-11-01'), dateEnd: new Date('2022-11-03') },
            { requestID: 1002, patientID: 1000, category: 'Serology', status: 'Completed', dateStart: new Date('2023-09-15'), dateEnd: new Date('2023-09-20') },
        ]);

        const res = await request(app).get('/requests').query({ lowerdatest: '2023-01-01' });
        expect(res.status).toBe(200);
        expect(res.body.flat()).toHaveLength(2); // Two requests in total
    });

    // Test with only upper bound on dateStart
    it('should filter requests with dateStart less than or equal to upperdatest', async () => {
        
        await appdata.requestModel.insertMany([
            { requestID: 1000, patientID: 1000, category: 'Hematology', status: 'Completed', dateStart: new Date('2025-10-01'), dateEnd: new Date('2025-10-05') },
            { requestID: 1001, patientID: 1001, category: 'Chemistry', status: 'In Progress', dateStart: new Date('2023-11-01'), dateEnd: new Date('2023-11-03') },
            { requestID: 1002, patientID: 1000, category: 'Serology', status: 'Completed', dateStart: new Date('2025-09-15'), dateEnd: new Date('2025-09-20') },
        ]);

        const res = await request(app).get('/requests').query({ upperdatest: '2024-12-31' });
        expect(res.status).toBe(200);
        expect(res.body.flat()).toHaveLength(1); // One request in total
    });

    // Test with both lower and upper bounds on dateStart
    it('should filter requests with dateStart between lowerdatest and upperdatest', async () => {

        await appdata.requestModel.insertMany([
            { requestID: 1000, patientID: 1000, category: 'Hematology', status: 'Completed', dateStart: new Date('2023-10-01'), dateEnd: new Date('2023-10-05') },
            { requestID: 1001, patientID: 1001, category: 'Chemistry', status: 'In Progress', dateStart: new Date('2023-11-01'), dateEnd: new Date('2023-11-03') },
            { requestID: 1002, patientID: 1000, category: 'Serology', status: 'Completed', dateStart: new Date('2024-09-15'), dateEnd: new Date('2024-09-20') },
        ]);

        const res = await request(app).get('/requests').query({ lowerdatest: '2024-01-01', upperdatest: '2024-12-31' });
        expect(res.status).toBe(200);
        expect(res.body.flat()).toHaveLength(1); // One request in total
    });

    // Test with only lower bound on dateEnd
    it('should filter requests with dateEnd greater than or equal to lowerdateen', async () => {

        await appdata.requestModel.insertMany([
            { requestID: 1000, patientID: 1000, category: 'Hematology', status: 'Completed', dateStart: new Date('2024-10-01'), dateEnd: new Date('2024-10-05') },
            { requestID: 1001, patientID: 1001, category: 'Chemistry', status: 'In Progress', dateStart: new Date('2024-11-01'), dateEnd: new Date('2024-11-03') },
            { requestID: 1002, patientID: 1000, category: 'Serology', status: 'Completed', dateStart: new Date('2023-09-15'), dateEnd: new Date('2023-09-20') },
        ]);

        const res = await request(app).get('/requests').query({ lowerdateen: '2024-06-01' });
        expect(res.status).toBe(200);
        expect(res.body.flat()).toHaveLength(2); // Two requests in total
    });

    // Test with only upper bound on dateEnd
    it('should filter requests with dateEnd less than or equal to upperdateen', async () => {

        await appdata.requestModel.insertMany([
            { requestID: 1000, patientID: 1000, category: 'Hematology', status: 'Completed', dateStart: new Date('2025-10-01'), dateEnd: new Date('2025-10-05') },
            { requestID: 1001, patientID: 1001, category: 'Chemistry', status: 'In Progress', dateStart: new Date('2023-11-01'), dateEnd: new Date('2023-11-03') },
            { requestID: 1002, patientID: 1000, category: 'Serology', status: 'Completed', dateStart: new Date('2025-09-15'), dateEnd: new Date('2025-09-20') },
        ]);

        const res = await request(app).get('/requests').query({ upperdateen: '2024-12-31' });
        expect(res.status).toBe(200);
        expect(res.body.flat()).toHaveLength(1); // One request in total
    });

    // Test with both lower and upper bounds on dateEnd
    it('should filter requests with dateEnd between lowerdateen and upperdateen', async () => {

        await appdata.requestModel.insertMany([
            { requestID: 1000, patientID: 1000, category: 'Hematology', status: 'Completed', dateStart: new Date('2023-10-01'), dateEnd: new Date('2023-10-05') },
            { requestID: 1001, patientID: 1001, category: 'Chemistry', status: 'In Progress', dateStart: new Date('2025-11-01'), dateEnd: new Date('2025-11-03') },
            { requestID: 1002, patientID: 1000, category: 'Serology', status: 'Completed', dateStart: new Date('2024-09-15'), dateEnd: new Date('2024-09-20') },
        ]);

        const res = await request(app).get('/requests').query({ lowerdateen: '2024-01-01', upperdateen: '2024-12-31' });
        expect(res.status).toBe(200);
        expect(res.body.flat()).toHaveLength(1); // One request in total
    });

    // Test with both dateStart and dateEnd ranges
    it('should filter requests with dateStart and dateEnd within specified ranges', async () => {

        await appdata.requestModel.insertMany([
            { requestID: 1000, patientID: 1000, category: 'Hematology', status: 'Completed', dateStart: new Date('2024-05-01'), dateEnd: new Date('2024-11-05') },
            { requestID: 1001, patientID: 1001, category: 'Chemistry', status: 'In Progress', dateStart: new Date('2024-11-01'), dateEnd: new Date('2025-11-03') },
            { requestID: 1002, patientID: 1000, category: 'Serology', status: 'Completed', dateStart: new Date('2023-09-15'), dateEnd: new Date('2024-09-20') },
        ]);

        const res = await request(app).get('/requests').query({
                lowerdatest: '2024-01-01',
                upperdatest: '2024-06-30',
                lowerdateen: '2024-07-01',
                upperdateen: '2024-12-31'
            });
        expect(res.status).toBe(200);
        expect(res.body.flat()).toHaveLength(1); // One request in total
    });
});