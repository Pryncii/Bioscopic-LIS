// mongodb+srv://princebuencamino:LIS092901@lis.1ioj1.mongodb.net/?retryWrites=true&w=majority&appName=LIS

const express = require('express')
const connectDB = require('./db.js')
const { appdata } = require("./models/data");
const cors = require('cors')
const bcrypt = require('bcrypt')
const {
    userModel,
    patientModel,
    requestModel,
    hematologyModel,
    clinicalMicroscopyModel,
    chemistryModel,
    serologyModel,
    // Use this model to look for the corresponding test
    // Note: Can't query specific values of tests, use other
    // Models to query a specific category
    allTestModel
} = appdata;

const app = express()
const port = process.env.PORT || 4000;

app.use(express.json())
app.use(cors({origin: 'http://localhost:3000'}));
connectDB()

app.get('/', async (req, res) => {
    try {
        // Fetch data from all models
        const users = await userModel.find();
        const patients = await patientModel.find();
        const requests = await requestModel.find();
        const hematologyTests = await hematologyModel.find();
        const clinicalMicroscopyTests = await clinicalMicroscopyModel.find();
        const chemistryTests = await chemistryModel.find();
        const serologyTests = await serologyModel.find();
        const allTests = await allTestModel.find();

        // Return the combined data as an object
        res.json({
            users,
            patients,
            requests,
            hematologyTests,
            clinicalMicroscopyTests,
            chemistryTests,
            serologyTests,
            allTests
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/patients', async (req, res) => {
    try {
        // Fetch data from all patients
        const patients = await patientModel.find();
        const requests = await requestModel.find();
        let patientData = [[]];

        // Iterate over each patient
        let i = 0;
        for (const patient of patients) {
            // Filter requests for the current patient
            const patientRequests = requests.filter(request => request.patientID === patient.patientID);

            // Find the latest dateStart among the requests for this patient
            const latestRequest = patientRequests.reduce((latest, current) => {
                const currentDateStart = current.dateStart;

                // Skip current if dateStart is 'N/A' or not a valid date
                if (currentDateStart === 'N/A' || isNaN(new Date(currentDateStart))) {
                    return latest; // Skip this entry
                }

                // If latest is null, set current as the latest
                if (!latest) {
                    return current;
                }

                const latestDateStart = latest.dateStart;

                // Skip latest if its dateStart is 'N/A' or not a valid date
                if (latestDateStart === 'N/A' || isNaN(new Date(latestDateStart))) {
                    return current; // If latest is invalid, return current
                }

                // Both dates are valid, compare them
                return new Date(currentDateStart) > new Date(latestDateStart) ? current : latest;
            }, null);

            // Add the patient data along with the latest dateStart if found
            if (latestRequest) {
                const formattedDate = latestRequest.dateStart
                    ? new Date(latestRequest.dateStart).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })
                    : "N/A";
                patientData[i].push({
                    patientID: patient.patientID,
                    name: patient.name,
                    latestDate: formattedDate,
                    remarks: patient.remarks,
                });
            } else {
                patientData[i].push({
                    patientID: patient.patientID,
                    name: patient.name,
                    latestDate: "N/A",
                    remarks: patient.remarks,
                });
            }
            if (patientData[i].length == 5) {
                i++;
                patientData[i] = [];
            }
        }

        res.json(patientData);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/register', async (req, res) => {
    const { firstName, middleName, lastName, sex, phoneNumber, username, email, password, prc } = req.body;

    try {
        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists!' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            name: `${lastName}, ${firstName} ${middleName}`,
            username,
            email,
            phoneNo: phoneNumber,
            sex,
            password: hashedPassword,
            prcno: prc,
            isMedtech: !!prc
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.post('/addpatient', async (req,res) => {
    const {name, sex, birthday, age, phoneNumber, email, pwdID, seniorID, address, remarks} = req.body;
    try{
        //automate the patientID for the new patients
        const latestPatient = await patientModel.findOne({}, { patientID: 1 }).sort({ patientID: -1 });
        const newPatientID = latestPatient ? latestPatient.patientID + 1 : 1;

        //create new patient
        const patient = new patientModel({
            patientID: newPatientID,
            name, 
            sex, 
            birthday, 
            age, 
            phoneNo: phoneNumber, 
            email, 
            pwdID, 
            seniorID, 
            address, 
            remarks});
        
            const date = new Date();
            const currentYear = date.getFullYear();
            const realAge = currentYear - patient.birthyear;

        //validate the age and birth date
        if(patient.birthyear){
            if(realAge == patient.age){
                
            }
        }
        await patient.save();
        res.status(201).json({ message: 'Patient added successfully', patient });

    }catch (error){
        res.json({ message: 'Error adding patient', error: error.message});
    }
        

});

const server = app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});

module.exports = { app, server };