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

app.put("/api/requests/:requestID", async (req, res) => {
  const { requestID } = req.params;
  const { status, payStatus, remarks } = req.body;

  try {
    console.log("Received PUT request to update requestID:", requestID);
    console.log("New data:", { status, payStatus, remarks });

    // Get the current date and time
    const currentDate = new Date();

    // Prepare the update data
    const updateData = {
      status,
      payStatus,
      remarks,
    };

    // If the status is 'Completed', set dateEnd to the current date
    if (status === "Completed") {
      updateData.dateEnd = currentDate; // Add dateEnd to the update data
    }

    const updatedRequest = await requestModel.findOneAndUpdate(
      { requestID: parseInt(requestID) }, // Ensure requestID matches the schema type
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


app.listen(port, function(){
    console.log('Listening at port '+port);
  });
