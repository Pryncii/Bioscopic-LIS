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
    testOptionsModel,
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
        const testOptions = await testOptionsModel.find();
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
            testOptions,
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

app.get('/requests', async (req, res) => {
    try {
        // Fetch all patients and requests, with requests sorted by requestID in descending order
        const patients = await patientModel.find();
        const requests = await requestModel.find().sort({ requestID: -1 });
        
        // Create a map of patient IDs to patient names for quick lookups
        const patientMap = {};
        patients.forEach(patient => {
          patientMap[patient.patientID] = patient.name;
        });
    
        let requestData = [[]];
        let i = 0;
    
        // Iterate over each request to format the data
        for (const request of requests) {
          let statusColor;
          if (request.status === "Completed") {
            statusColor = "c";
          } else if (request.status === "In Progress") {
            statusColor = "ip";
          } else {
            statusColor = "req";
          }

          // Format dates if available, otherwise set to an empty string
          const formatDateTime = (date) => 
            date ? new Date(date).toLocaleString('en-US', {
              month: '2-digit', day: '2-digit', year: 'numeric',
              hour: '2-digit', minute: '2-digit', hour12: true
            }) : "";
          
          // Push formatted request data into the nested arrays
          requestData[i].push({
            requestID: request.requestID,
            patientID: request.patientID,
            name: patientMap[request.patientID], // Retrieve the name from the patient map
            tests: request.category,
            barColor: statusColor,
            requestStatus: request.status,
            remarks: request.remarks,
            paymentStatus: request.payStatus,
            dateRequested: formatDateTime(request.dateStart),
            dateCompleted: formatDateTime(request.dateEnd)
          });

          // Split into groups of 5
          if (requestData[i].length === 5) {
            i++;
            requestData[i] = [];
          }
        }
    
        // If the last subarray is empty, remove it
        if (requestData[requestData.length - 1].length === 0) {
          requestData.pop();
        }
    
        res.json(requestData);    
      
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

app.put("/api/requests/:requestID", async (req, res) => {
  const { requestID } = req.params;
  const { status, payStatus, remarks } = req.body;

  try {
    // console.log("Received PUT request to update requestID:", requestID);
    // console.log("New data:", { status, payStatus, remarks });

    // Prepare the update data
    const updateData = {
      status,
      payStatus,
      remarks,
    };
    
    // Set dateEnd to current date if status is "Completed", or remove it otherwise
    if (status === "Completed") {
      updateData.dateEnd = new Date(); // Set dateEnd to current date
    } else {
      updateData.dateEnd = null; // Remove dateEnd for other statuses
    }
    
    const updatedRequest = await requestModel.findOneAndUpdate(
      { requestID: parseInt(requestID) },
      updateData,
      { new: true }
    );

    if (!updatedRequest) {
      console.log("Request not found in database.");
      return res.status(404).json({ message: "Request not found" });
    }

    console.log("Request updated successfully:", updatedRequest);
    res.json(updatedRequest);
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get('/users', async (req, res) => {
  try {
      const users = await userModel.find();
      res.json(users);
  } catch (err) {
    console.error("Error updating request:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get('/testoptions', async (req, res) => {
  try {
      const testOptions = await testOptionsModel.find();
      res.json(testOptions);
  } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
  }
});
  
const server = app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});

module.exports = { app, server };
