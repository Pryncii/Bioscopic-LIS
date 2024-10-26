// mongodb+srv://princebuencamino:LIS092901@lis.1ioj1.mongodb.net/?retryWrites=true&w=majority&appName=LIS

const express = require ('express')
const connectDB = require('./db.js')
const { appdata } = require("./models/data");
const cors = require('cors')
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
app.use(cors())
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
            
            // Find the latest dateEnd among the requests for this patient
            const latestRequest = patientRequests.reduce((latest, current) => {
                const currentDateEnd = current.dateEnd;
            
                // Skip current if dateEnd is 'N/A' or not a valid date
                if (currentDateEnd === 'N/A' || isNaN(new Date(currentDateEnd))) {
                    return latest; // Skip this entry
                }
            
                // If latest is null, set current as the latest
                if (!latest) {
                    return current;
                }
            
                const latestDateEnd = latest.dateEnd;
            
                // Skip latest if its dateEnd is 'N/A' or not a valid date
                if (latestDateEnd === 'N/A' || isNaN(new Date(latestDateEnd))) {
                    return current; // If latest is invalid, return current
                }
            
                // Both dates are valid, compare them
                return new Date(currentDateEnd) > new Date(latestDateEnd) ? current : latest;
            }, null);            


            // Add the patient data along with the latest dateEnd if found
            if (latestRequest) {
                const formattedDate = new Date(latestRequest.dateEnd).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
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
            if(patientData[i].length == 5){
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

app.listen(port, function(){
    console.log('Listening at port '+port);
  });