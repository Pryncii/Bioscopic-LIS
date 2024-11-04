const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { app, server } = require("./index");
const { appdata } = require("./models/data");
const { userModel } = appdata;
const bcrypt = require("bcrypt");

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

describe("POST /login", () => {
    beforeEach(async () => {
        await userModel.deleteMany();
    });

    it("should login successfully with valid credentials", async () => {
        const hashedPassword = await bcrypt.hash("password", 10);
        const user = {
            username: "johnsmith",
            password: hashedPassword,
        };
        await userModel.create(user);

        const response = await request(app)
            .post("/login")
            .send({ username: user.username, password: "password" });
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Login successful");
    });

    it("should return an error if the account does not exist", async () => {
        const response = await request(app)
            .post("/login")
            .send({ username: "doesnotexist", password: "password" });
        
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Account does not exist");
    });

    it("should return an error if the password is incorrect", async () => {
        const hashedPassword = await bcrypt.hash("password", 10);
        const user = {
            username: "johnsmith",
            password: hashedPassword,
        };
        await userModel.create(user);

        const response = await request(app)
            .post("/login")
            .send({ username: user.username, password: "incorrect" });
        
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Incorrect password");
    });
});
