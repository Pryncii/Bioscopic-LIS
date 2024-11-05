const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { app, server } = require("./index");
const { appdata } = require("./models/data");

const { userModel } = appdata;

let mongoServer;

beforeAll(async () => {
    process.env.NODE_ENV = "test";
    mongoServer = await MongoMemoryServer.create({
        binary: { version: "5.0.3" },
    });
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

describe("POST /register", () => {
    beforeEach(async () => {
        await userModel.deleteMany();
    });

    it("should register a new user successfully without PRC number", async () => {
        const newUser = {
            firstName: "John",
            middleName: "Doe",
            lastName: "Smith",
            sex: "M",
            phoneNumber: "09123456789",
            username: "johnsmith",
            email: "johnsmith@example.com",
            password: "password",
            prc: "",
        };

        const response = await request(app).post("/register").send(newUser);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("User registered successfully!");

        const user = await userModel.findOne({ username: newUser.username });
        expect(user).not.toBeNull();
        expect(user.isMedtech).toBe(false);
    });

    it("should register a new user successfully with PRC number", async () => {
        const newUser = {
            firstName: "John",
            middleName: "Doe",
            lastName: "Smith",
            sex: "M",
            phoneNumber: "09123456789",
            username: "johnsmith",
            email: "johnsmith@example.com",
            password: "password",
            prc: "1234567889",
        };

        const response = await request(app).post("/register").send(newUser);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("User registered successfully!");

        const user = await userModel.findOne({ username: newUser.username });
        expect(user).not.toBeNull();
        expect(user.isMedtech).toBe(true);
    });

    it("should return an error if the username already exists", async () => {
        const existingUser = {
            firstName: "John",
            middleName: "Doe",
            lastName: "Smith",
            sex: "M",
            phoneNumber: "09123456789",
            username: "johnsmith",
            email: "johnsmith@example.com",
            password: "password",
            prc: "",
        };

        await userModel.create(existingUser);

        const newUser = {
            firstName: "John",
            middleName: "Dee",
            lastName: "Smith",
            sex: "M",
            phoneNumber: "09123456789",
            username: "johnsmith",
            email: "johnsmith@example.com",
            password: "password",
            prc: "",
        };

        const response = await request(app).post("/register").send(newUser);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Username already exists!");
    });
});
