const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { app, server } = require("./index"); // Adjust the import according to your app structure
const nodemailer = require("nodemailer");

// Mock nodemailer to avoid actual email sending
jest.mock('nodemailer', () => ({
    createTransport: jest.fn(),
}));

let mongoServer;

beforeAll(async () => {
    let mockTransporter;

    process.env.NODE_ENV = "test";
    mongoServer = await MongoMemoryServer.create({
        binary: { version: "5.0.3" },
    });
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    mockTransporter = {
        sendMail: jest.fn().mockResolvedValue("Email sent"),
    };
    nodemailer.createTransport.mockReturnValue(mockTransporter);

    // Mock console.error to suppress the output in tests
    console.error = jest.fn();
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

describe("POST /send-pdf-email", () => {
    let mockTransporter;

    beforeAll(() => {
        // Mock nodemailer.createTransport
        mockTransporter = {
            sendMail: jest.fn().mockResolvedValue("Email sent"),
        };

        // Ensure createTransport is mocked properly
        nodemailer.createTransport.mockReturnValue(mockTransporter);
    });

    beforeEach(() => {
        // Reset the mock transporter before each test
        mockTransporter.sendMail.mockClear();
    });

    it("should send an email with the PDF attached", async () => {
        const formData = {
            requestName: "Doe, John",
            category: "Hematology",
        };

        const mockPdf = Buffer.from("Fake PDF Content"); // Mock a PDF buffer

        const response = await request(app)
            .post("/send-pdf-email")
            .set("Content-Type", "multipart/form-data")
            .field("email", "john.doe@example.com")
            .field("formData", JSON.stringify(formData))
            .attach("pdf", mockPdf, "test.pdf");

        // Assertions
        expect(response.status).toBe(200);
        expect(response.text).toBe("Email sent successfully.");

        // Verify sendMail is called with the correct arguments
        expect(mockTransporter.sendMail).toHaveBeenCalledWith({
            from: '"Bioscopic Diagnostic Laboratory" <bioscopicdiagnosticlaboratory@gmail.com>',
            to: "john.doe@example.com",
            subject: "John Doe Hematology Test Results",
            text: "Hello Mx. Doe,\n\nAttached in this email are your hematology test results.",
            attachments: [
                {
                    filename: "DoeJ_Hematology.pdf",
                    content: mockPdf,
                },
            ],
        });
    });

    it("should return 500 if sending email fails", async () => {
        // Mock sendMail to reject with an error
        mockTransporter.sendMail.mockRejectedValueOnce(new Error("Email sending failed"));

        const formData = {
            requestName: "Doe, Jane",
            category: "Serology",
        };

        const mockPdf = Buffer.from("Another Fake PDF Content");

        const response = await request(app)
            .post("/send-pdf-email")
            .set("Content-Type", "multipart/form-data")
            .field("email", "jane.doe@example.com")
            .field("formData", JSON.stringify(formData))
            .attach("pdf", mockPdf, "test.pdf");

        expect(response.status).toBe(500);
        expect(response.text).toBe("Failed to send email.");
    });
});
