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

app.get('/requests', async (req, res) => {
    try {
      const patients = await patientModel.find({}, {  //  send all of the patients' information
        patientID: 1,
        name: 1,
        sex: 1,
        phoneNo: 1,
        email: 1,
        age: 1,
        birthday: 1,
        address: 1,
        _id: 0
      });
      res.json(patients);

        // // Fetch all patients and requests, with requests sorted by requestID in descending order
        // const patients = await patientModel.find();
        // const requests = await requestModel.find().sort({ requestID: -1 });
        
        // // Create a map of patient IDs to patient names for quick lookups
        // const patientMap = {};
        // patients.forEach(patient => {
        //   patientMap[patient.patientID] = patient.name;
        // });
    
        // let requestData = [[]];
        // let i = 0;
    
        // // Iterate over each request to format the data
        // for (const request of requests) {
        //   let statusColor;
        //   if (request.status === "Completed") {
        //     statusColor = "c";
        //   } else if (request.status === "In Progress") {
        //     statusColor = "ip";
        //   } else {
        //     statusColor = "req";
        //   }

        //   // Format dates if available, otherwise set to an empty string
        //   const formatDateTime = (date) => 
        //     date ? new Date(date).toLocaleString('en-US', {
        //       month: '2-digit', day: '2-digit', year: 'numeric',
        //       hour: '2-digit', minute: '2-digit', hour12: true
        //     }) : "";
          
        //   // Push formatted request data into the nested arrays
        //   requestData[i].push({
        //     requestID: request.requestID,
        //     patientID: request.patientID,
        //     name: patientMap[request.patientID], // Retrieve the name from the patient map
        //     tests: request.category,
        //     barColor: statusColor,
        //     requestStatus: request.status,
        //     remarks: request.remarks,
        //     paymentStatus: request.payStatus,
        //     dateRequested: formatDateTime(request.dateStart),
        //     dateCompleted: formatDateTime(request.dateEnd)
        //   });

        //   // Split into groups of 5
        //   if (requestData[i].length === 5) {
        //     i++;
        //     requestData[i] = [];
        //   }
        // }
    
        // // If the last subarray is empty, remove it
        // if (requestData[requestData.length - 1].length === 0) {
        //   requestData.pop();
        // }
    
        // res.json(requestData);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/requests', async (req, res) => {
  try {
    const createRequest = async (requestData) => {
      try {
        const newRequest = new requestModel(requestData);
        await newRequest.save(); 
        console.log('Request created:', newRequest);
      } catch (error) {
        console.error('Error creating request:', error);
        throw error;
      }
    };
    const createTest = async (testData, category) => {
      try {
        const modelMap = {  //model based on the category
          "Hematology": hematologyModel,
          "Clinical Microscopy": clinicalMicroscopyModel,
          "Chemistry": chemistryModel,
          "Serology": serologyModel
        };
      
        const Model = modelMap[category];
        if (Model) {
          const newTest = new Model(testData);
          await newTest.save();
          console.log('Test created:', newTest);
        } else {
          console.log('Error in Creating a Request');
        }
      
      } catch (error) {
        console.error('Error creating request:', error);
        throw error;
      }
    };

    const latestDocument = await requestModel.findOne({}, null, { sort: { requestID: -1 } });
    const latestId = latestDocument ? latestDocument.requestID : 1000;
    let newReqId = latestId + 1; // Get new secondary id

    const currentDate = new Date(); // Get the current date

    const { tests, patientID , payment } = req.body;

    const requests = {  //  preparation for grouping tests later
      "Hematology": [],
      "Clinical Microscopy": [],
      "Chemistry": [],
      "Serology": []
    };
    
    for (const [test, category] of Object.entries(tests)) { //  bin every test to their corresponding category
      if (category === "Hematology") {
        requests["Hematology"].push(test);
      } else if (category === "Clinical Microscopy") {
        requests["Clinical Microscopy"].push(test);
      } else if (category === "Chemistry") {
        requests["Chemistry"].push(test);
      } else if (category === "Serology") {
        requests["Serology"].push(test);
      }
    }

    for (const [category, tests] of Object.entries(requests)) {
      if (tests.length > 0) { //  if the category has tests
        const stringTests = tests.join(", ")
        await createRequest({
          requestID: newReqId,
          patientID: patientID,
          medtechID: 2000, // Replace with actual medtech ID
          category: category,
          test: stringTests,
          status: "Requested",
          dateStart: currentDate,
          dateEnd: null,
          remarks: "",
          payStatus: payment 
        });

        for (const test of tests) { // create the new test for every test in tests
          let newTest = {
            requestID: newReqId,
          };
    
          if (category == "Hematology") {
            switch(test){
              case "CBC with Platelet Count":
                newTest.withPlateletCount = true;
                newTest.plateletCount = -1;
              case "CBC": 
                newTest.hemoglobin = -1;
                newTest.hematocrit = -1;
                newTest.rbcCount = -1;
                newTest.wbcCount = -1;
                newTest.neutrophil = -1;
                newTest.lymphocyte = -1;
                newTest.eosinophil = -1;
                newTest.basophil = -1;
                break;
              case "ESR":
                newTest.esr = -1;
                break;
              case "Blood Type with Rh":
                newTest.bloodWithRh = -1;
                break;
              case "Clotting Time":
                newTest.clottingTime = -1;
                break;
              case "Breeding Time":
                newTest.bleedingTime = -1;
                break;
              default:
                console.log("Unknown test key: ", test);
                break;
            }
          }
          else if (category == "Clinical Microscopy") {
            newTest.color = "";
            newTest.bacteria = "";
            newTest.rbc = -1;
            newTest.pus = -1;
            switch(test){
              case "Urinalysis": 
                newTest.transparency = "";
                newTest.pH = -1;
                newTest.specificGravity = -1;
                newTest.sugar = "";
                newTest.protein = "";
                newTest.epithelialCells = "";
                newTest.mucusThread = "";
                break;
              case "Fecalysis":
                newTest.consistency = "";
                newTest.wbc = -1;
                newTest.ovaParasite = "";
                newTest.fatGlobule = "";
                newTest.bileCrystal = "";
                newTest.vegetableFiber = "";
                newTest.meatFiber = "";
                newTest.erythrocyte = -1;
                newTest.yeastCell = -1;
                break;
              case "FOBT":
                // newTest.fobt = -1;
                break;
              default:
                console.log("Unknown test key: ", test);
                break;
            }
          }
          else if (category == "Chemistry") {
            switch(test){
              case "FBS": 
                newTest.fbs = -1;
                break;
              case "RBS": 
                newTest.rbs = -1;
                break;
              case "Creatinine": 
                newTest.creatinine = -1;
                break;
              case "Uric Acid": 
                newTest.uricAcid = -1;
                break;
              case "Cholesterol": 
                newTest.cholesterol = -1;
                break;
              case "Triglycerides": 
                newTest.triglycerides = -1;
                break;
              case "HDL": 
                newTest.hdl = -1;
                break;
              case "LDL":
                newTest.ldl = -1;
                break;
              case "VLDL": 
                newTest.vldl = -1;
                break;
              case "BUN": 
                newTest.bun = -1;
                break;
              case "SGPT": 
                newTest.sgpt = -1;
                break;
              case "SGOT": 
                newTest.sgot = -1;
                break;
              case "HbA1c": 
                newTest.hba1c = -1;
                break;
              default:
                console.log("Unknown test key: ", test);
                break;
            }
          }
          else if (category == "Serology") {
            switch(test){
              case "HbsAg": 
                newTest.hbsAg = -1;
                break;
              case "RPR/VDRL": 
                newTest.rprVdrl = -1;
                break;
              case "Serum Pregnancy Test": 
                newTest.pregnancyTestSerum = -1;
                break;
              case "Urine Pregnancy Test": 
                newTest.pregnancyTestUrine = -1;
                break;
              case "Dengue NS1": 
                newTest.dengueNs1 = -1;
                break;
              case "Dengue Duo": 
                newTest.dengueDuo = -1;
                break;
              default:
                console.log("Unknown test key: ", test);
                break;
            }
          }
          else {
            console.log("Error in Creating a Request: ", category);
          }
          await createTest(newTest, category);
        }
        newReqId++; //  increment internal counter for request ID
      }
    }
      res.status(201).json({ message: 'Requests created successfully with latest ID', newReqId }); // Respond with success message
  } catch (error) {
      console.error('Failed to create request:', error);
      res.status(500).json({ error: 'Failed to create request' }); // Respond with an error message
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
