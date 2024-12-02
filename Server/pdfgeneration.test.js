const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, server } = require('./index');
const { PDFDocument } = require('pdf-lib');
const pdfParse = require('pdf-parse'); // Import pdf-parse
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

beforeEach(async () => {
    await patientModel.deleteMany();
    await requestModel.deleteMany();
    await userModel.deleteMany();
});

it('should generate a PDF for a valid hematology request', async () => {
    // Mock database data
    const requestData = await requestModel.create({ requestID: '1000', patientID: '1000', medtechID: '1' });
    await patientModel.create({ name: 'John Doe', patientID: '1000', age: 30, sex: 'M' });
    await userModel.create({ medtechID: '1', name: 'Dr. Smith' });


    const response = await request(app)
        .post('/generate-pdf')
        .send({
            requestID: '1000',
            requestName: 'John Doe',
            category: 'Hematology',
            hemoglobin: 13.5,
        });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/pdf');
    
    // Extract text content from the PDF
    const pdfText = await pdfParse(response.body);

    // Validate text content
    expect(pdfText.text.includes('JOHN DOE')).toBe(true);
    expect(pdfText.text.includes('30/M')).toBe(true);
    expect(pdfText.text.includes('Dr. Smith')).toBe(true);
    expect(pdfText.text.includes('HEMATOLOGY')).toBe(true);
    expect(pdfText.text.includes('13.5')).toBe(true);
});

it('should generate a PDF for a valid clinical microscopy request', async () => {
    // Mock database data
    const requestData = await requestModel.create({ requestID: '1001', patientID: '1001', medtechID: '1' });
    await patientModel.create({ name: 'Jane Doe', patientID: '1001', age: 20, sex: 'F' });
    await userModel.create({ medtechID: '1', name: 'Dr. Smith' });


    const response = await request(app)
        .post('/generate-pdf')
        .send({
            requestID: '1001',
            requestName: 'Jane Doe',
            category: 'Clinical Microscopy',
            color: 'Yellow',
            pH: 4.0
        });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/pdf');
    
    // Extract text content from the PDF
    const pdfText = await pdfParse(response.body);
    //console.log(pdfText);

    // Validate text content
    expect(pdfText.text.includes('JANE DOE')).toBe(true);
    expect(pdfText.text.includes('20/F')).toBe(true);
    expect(pdfText.text.includes('Dr. Smith')).toBe(true);
    expect(pdfText.text.includes('CLINICAL MICROSCOPY')).toBe(true);
    expect(pdfText.text.includes('Yellow')).toBe(true);
    expect(pdfText.text.includes('4')).toBe(true);
});

it('should generate a PDF for a valid chemistry request', async () => {
    // Mock database data
    const requestData = await requestModel.create({ requestID: '1002', patientID: '1002', medtechID: '1' });
    await patientModel.create({ name: 'Joan Doe', patientID: '1002', age: 24, sex: 'F' });
    await userModel.create({ medtechID: '1', name: 'Dr. Smith' });


    const response = await request(app)
        .post('/generate-pdf')
        .send({
            requestID: '1002',
            requestName: 'Joan Doe',
            category: 'Chemistry',
            ldl: 3,
            vldl: 5,
            bun: 2
        });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/pdf');
    
    // Extract text content from the PDF
    const pdfText = await pdfParse(response.body);

    // Validate text content
    expect(pdfText.text.includes('JOAN DOE')).toBe(true);
    expect(pdfText.text.includes('24/F')).toBe(true);
    expect(pdfText.text.includes('Dr. Smith')).toBe(true);
    expect(pdfText.text.includes('CHEMISTRY')).toBe(true);
    expect(pdfText.text.includes('3')).toBe(true);
    expect(pdfText.text.includes('5')).toBe(true);
    expect(pdfText.text.includes('2')).toBe(true);
});

it('should generate a PDF for a valid serology request', async () => {
    // Mock database data
    const requestData = await requestModel.create({ requestID: '1003', patientID: '1003', medtechID: '1' });
    await patientModel.create({ name: 'Juan Doe', patientID: '1003', age: 38, sex: 'M' });
    await userModel.create({ medtechID: '1', name: 'Dr. Smith' });


    const response = await request(app)
        .post('/generate-pdf')
        .send({
            requestID: '1003',
            requestName: 'Juan Doe',
            category: 'Serology',
            dengueDuo: 'Positive',
        });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/pdf');
    
    // Extract text content from the PDF
    const pdfText = await pdfParse(response.body);

    // Validate text content
    expect(pdfText.text.includes('JUAN DOE')).toBe(true);
    expect(pdfText.text.includes('38/M')).toBe(true);
    expect(pdfText.text.includes('Dr. Smith')).toBe(true);
    expect(pdfText.text.includes('SEROLOGY')).toBe(true);
    expect(pdfText.text.includes('Positive')).toBe(true);
});
