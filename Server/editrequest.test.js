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

describe('ModalEditRequest Component', () => {
    beforeEach(async () => {
        // Clear previous data in MongoDB
        await patientModel.deleteMany();
        await requestModel.deleteMany();
        await userModel.deleteMany();
        
        // Insert mock data into MongoDB
        await userModel.insertMany([
            { prcno: '1234', name: 'MedTech A' },
            { prcno: '5678', name: 'MedTech B' },
        ]);
    });

    it('should render text field if isText is true', async () => {
        // Mock props for the component
        const mockProps = {
            patient: { name: 'John Doe', patientID: 1, requestID: 1 },
            category: 'Hematology',
            tests: 'Test A, Test B',
            show: true,
            handleClose: jest.fn(),
        };

        const testOptions = [
            { name: 'Test A', options: ['Option A1', 'Option A2'] },
            { name: 'Test B', options: [] }, // Test B is a text field (no options)
        ];

        // Mock fetch responses
        global.fetch = jest.fn((url) =>
            Promise.resolve({
                ok: true,
                json: () => (url.includes('testoptions') ? testOptions : []),
            })
        );

        render(<ModalEditRequest {...mockProps} />);

        // Check if the Test B field is rendered as a text input
        const textField = screen.getByLabelText('Test B');
        expect(textField).toBeInTheDocument();
    });

    it('should render dropdown with options if isText is false', async () => {
        // Mock props for the component
        const mockProps = {
            patient: { name: 'John Doe', patientID: 1, requestID: 1 },
            category: 'Hematology',
            tests: 'Test A, Test B',
            show: true,
            handleClose: jest.fn(),
        };

        const testOptions = [
            { name: 'Test A', options: ['Option A1', 'Option A2'] },
        ];

        // Mock fetch responses
        global.fetch = jest.fn((url) =>
            Promise.resolve({
                ok: true,
                json: () => (url.includes('testoptions') ? testOptions : []),
            })
        );

        render(<ModalEditRequest {...mockProps} />);

        // Check if Test A field is rendered as a dropdown
        const dropdown = screen.getByLabelText('Test A');
        expect(dropdown).toBeInTheDocument();

        // Check if the dropdown has the correct options
        const option1 = screen.getByText('Option A1');
        const option2 = screen.getByText('Option A2');
        expect(option1).toBeInTheDocument();
        expect(option2).toBeInTheDocument();
    });

    it('should handle closing the modal', async () => {
        // Mock props for the component
        const mockProps = {
            patient: { name: 'John Doe', patientID: 1, requestID: 1 },
            category: 'Hematology',
            tests: 'Test A, Test B',
            show: true,
            handleClose: jest.fn(),
        };

        render(<ModalEditRequest {...mockProps} />);

        // Simulate closing the modal
        const closeButton = screen.getByRole('button', { name: /close/i });
        userEvent.click(closeButton);

        // Assert that the handleClose function was called
        expect(mockProps.handleClose).toHaveBeenCalled();
    });
});
