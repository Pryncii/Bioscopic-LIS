const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, server } = require('./index'); // Ensure your app and server are exported from index
const { appdata } = require("./models/data");
const { requestModel } = appdata; // Adjust based on how models are structured

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}, 50000);

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    if (server) {
        server.close();
    }
});

describe("Request Status Update", () => {
    let testRequest;

    beforeEach(async () => {
        testRequest = await requestModel.create({
            requestID: 1234,
            patientID: 5678,
            status: "Requested",
            payStatus: "Unpaid",
            remarks: "Initial Test",
            dateEnd: null,
        });
    });

    afterEach(async () => {
        await requestModel.deleteMany({});
    });

    test("should set status to 'Completed' and add dateEnd when status is 'Completed'", async () => {
        const response = await request(app) // Use the app instance here
            .put(`/api/requests/${testRequest.requestID}`)
            .send({
                status: "Completed",
                payStatus: "Paid",
                remarks: "Test completed",
            });

        expect(response.status).toBe(200);
        const updatedRequest = await requestModel.findOne({ requestID: testRequest.requestID });

        expect(updatedRequest.status).toBe("Completed");
        expect(updatedRequest.payStatus).toBe("Paid");
        expect(updatedRequest.remarks).toBe("Test completed");
        expect(updatedRequest.dateEnd).not.toBeNull();
    });

    test("should set status to 'In Progress' without setting dateEnd", async () => {
        const response = await request(app) // Use the app instance here
            .put(`/api/requests/${testRequest.requestID}`)
            .send({
                status: "In Progress",
                payStatus: "Pending",
                remarks: "Work in progress",
            });

        expect(response.status).toBe(200);
        const updatedRequest = await requestModel.findOne({ requestID: testRequest.requestID });

        expect(updatedRequest.status).toBe("In Progress");
        expect(updatedRequest.payStatus).toBe("Pending");
        expect(updatedRequest.remarks).toBe("Work in progress");
        expect(updatedRequest.dateEnd).toBeNull();
    });

    test("should set status to 'Requested' without setting dateEnd", async () => {
        const response = await request(app) // Use the app instance here
            .put(`/api/requests/${testRequest.requestID}`)
            .send({
                status: "Requested",
                payStatus: "Unpaid",
                remarks: "Request initiated",
            });

        expect(response.status).toBe(200);
        const updatedRequest = await requestModel.findOne({ requestID: testRequest.requestID });

        expect(updatedRequest.status).toBe("Requested");
        expect(updatedRequest.payStatus).toBe("Unpaid");
        expect(updatedRequest.remarks).toBe("Request initiated");
        expect(updatedRequest.dateEnd).toBeNull();
    });
});
