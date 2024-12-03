// mongodb+srv://princebuencamino:LIS092901@lis.1ioj1.mongodb.net/?retryWrites=true&w=majority&appName=LIS

const express = require("express");
const connectDB = require("./db.js");
const { appdata } = require("./models/data");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const multer = require("multer");

const { PDFDocument, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;

const session = require("express-session");
const mongoStore = require("connect-mongodb-session")(session);

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
  allTestModel,
} = appdata;

const app = express();
const upload = multer();
const port = process.env.PORT || 4000;

app.use(express.json());

app.use(cors({
  origin: ["http://localhost:3000", "https://bioscopic-lis.onrender.com"],
  credentials: true
}));

connectDB();

app.use(
  session({
    secret: "DLSU",
    saveUninitialized: false,
    resave: false,
    store: new mongoStore({
      uri: "mongodb+srv://princebuencamino:LIS092901@lis.1ioj1.mongodb.net/labDB?retryWrites=true&w=majority&appName=LIS", // Replace with your actual connection string
      collection: "sessions",
      expires: 21 * 24 * 60 * 60 * 1000,
    }),
  })
);

app.get("/patients", async (req, res) => {
  try {
    // Fetch data from all patients
    const patients = await patientModel.find();
    const requests = await requestModel.find();
    let patientData = [[]];

    // Iterate over each patient
    let i = 0;
    for (const patient of patients) {
      // Filter requests for the current patient
      const patientRequests = requests.filter(
        (request) => request.patientID === patient.patientID
      );

      // Find the latest dateStart among the requests for this patient
      const latestRequest = patientRequests.reduce((latest, current) => {
        const currentDateStart = current.dateStart;

        // Skip current if dateStart is 'N/A' or not a valid date
        if (currentDateStart === "N/A" || isNaN(new Date(currentDateStart))) {
          return latest; // Skip this entry
        }

        // If latest is null, set current as the latest
        if (!latest) {
          return current;
        }

        const latestDateStart = latest.dateStart;

        // Skip latest if its dateStart is 'N/A' or not a valid date
        if (latestDateStart === "N/A" || isNaN(new Date(latestDateStart))) {
          return current; // If latest is invalid, return current
        }

        // Both dates are valid, compare them
        return new Date(currentDateStart) > new Date(latestDateStart)
          ? current
          : latest;
      }, null);

      // Add the patient data along with the latest dateStart if found
      if (latestRequest) {
        const formattedDate = latestRequest.dateStart
          ? new Date(latestRequest.dateStart).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
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
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/patienthistory", async (req, res) => {
  try {
    const { patientID } = req.query;
    const patient = await patientModel.findOne({ patientID: patientID }); // Retrieve patient data from DB
    let requestData = [[]];
    let i = 0;

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const requests = await requestModel.find({ patientID: patientID });

    // if (!requests || requests.length === 0) {
    //   return res.status(404).json({ error: "No requests found for this patient" });
    // }

    const getDate = (request) => new Date(request.dateEnd || request.dateStart);

      // Sort requests by dateEnd or dateStart (latest first)
    requests.sort((a, b) => getDate(b) - getDate(a));
    
    const formatDateTime = (date) =>
      date
        ? new Date(date).toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        : "";

    for (const request of requests) {
      

      // Push formatted request data into the nested arrays
      requestData[i].push({
        requestID: request.requestID,
        patientID: request.patientID,
        category: request.category,
        tests: request.test,
        remarks: request.remarks,
        dateRequested: formatDateTime(request.dateStart),
        dateCompleted: formatDateTime(request.dateEnd),
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
    
    res.json({
      patient: patient,
      requestData: requestData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/request", async (req, res) => {
  try {
    const patients = await patientModel.find(
      {},
      {
        patientID: 1,
        name: 1,
        sex: 1,
        phoneNo: 1,
        email: 1,
        age: 1,
        birthday: 1,
        address: 1,
        _id: 0,
      }
    );
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/requests", async (req, res) => {
  try {
    // Fetch all patients and requests, with requests sorted by requestID in descending order
    let searchQuery = { $and: [] };
    let listofID = [];
    let requestData = [[]];
    let i = 0;
    const patients = await patientModel.find();

    if (req.query.search !== undefined || req.query.search !== "") {
      const regex = new RegExp(req.query.search, "i"); // for case insentivity
      const patients = await patientModel.find({ name: regex });
      for (const item of patients) {
        //console.log(item.patientID);
        //console.log(item.name);
        listofID.push(item.patientID);
      }
      searchQuery.$and.push({
        $or: [
          { category: regex },
          { test: regex },
          { status: regex },
          { remarks: regex },
          { patientID: { $in: listofID } },
        ],
      });
    }
    const dateRangeQuerySt = {};
    const dateRangeQueryEn = {};
    if (
      req.query.lowerdatest !== "2000-01-01" &&
      req.query.lowerdatest !== undefined
    ) {
      const lowerDateSt = new Date(req.query.lowerdatest);
      dateRangeQuerySt["$gte"] = lowerDateSt;
      //console.log("LowerDatST " + lowerDateSt);
    }
    if (
      req.query.upperdatest !== "2100-12-31" &&
      req.query.upperdatest !== undefined
    ) {
      const upperDateSt = new Date(req.query.upperdatest);
      dateRangeQuerySt["$lte"] = upperDateSt;
      //console.log("UpperDateST " + upperDateSt);
    }
    if (
      req.query.lowerdateen !== "2000-01-01" &&
      req.query.lowerdateen !== undefined
    ) {
      const lowerDateEn = new Date(req.query.lowerdateen);
      dateRangeQueryEn["$gte"] = lowerDateEn;
      //console.log("LowerDateEN " + lowerDateEn);
    }
    if (
      req.query.upperdateen !== "2100-12-31" &&
      req.query.upperdateen !== undefined
    ) {
      const upperDateEn = new Date(req.query.upperdateen);
      dateRangeQueryEn["$lte"] = upperDateEn;
      //console.log("UpperDateEN " + upperDateEn);
      //console.log("");
    }
    if (Object.keys(dateRangeQuerySt).length > 0) {
      searchQuery.$and.push({ dateStart: dateRangeQuerySt });
    }
    if (Object.keys(dateRangeQueryEn).length > 0) {
      searchQuery.$and.push({ dateEnd: dateRangeQueryEn });
    }
    // Check if category is defined and non-empty
    if (req.query.category !== "AA" && req.query.category !== undefined) {
      // Add category query to the search query
      searchQuery.$and.push({ category: req.query.category });
    }
    // Check if test is defined and non-empty
    if (req.query.test !== "AAA" && req.query.test !== undefined) {
      // Add test query to the search query
      const regex2 = new RegExp(req.query.test, "i");
      searchQuery.$and.push({ test: regex2 });
    }
    // Check if status is defined and non-empty
    if (req.query.status !== "A" && req.query.status !== undefined) {
      // Add status query to the search query
      searchQuery.$and.push({ status: req.query.status });
    }
    //console.log("Search Query");
    //console.log(searchQuery);
    if (searchQuery.$and.length === 0) {
      searchQuery = {};
    }

    const requests = await requestModel
      .find(searchQuery)
      .sort({ requestID: -1 });

    // Create a map of patient IDs to patient names for quick lookups
    const patientMap = {};
    const emailMap = {};
    patients.forEach((patient) => {
      patientMap[patient.patientID] = patient.name;
      emailMap[patient.patientID] = patient.email;
    });

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
        date
          ? new Date(date).toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          : "";

      // Push formatted request data into the nested arrays
      requestData[i].push({
        requestID: request.requestID,
        patientID: request.patientID,
        name: patientMap[request.patientID], // Retrieve the name from the patient map
        category: request.category,
        tests: request.test,
        barColor: statusColor,
        requestStatus: request.status,
        remarks: request.remarks,
        paymentStatus: request.payStatus,
        dateRequested: formatDateTime(request.dateStart),
        dateCompleted: formatDateTime(request.dateEnd),
        email: emailMap[request.patientID]
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
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/requests/:requestID", async (req, res) => {
  try {
    const { requestID } = req.params;
    // Fetch the request by its requestID
    const request = await requestModel.findOne({ requestID });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Return the request data
    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/register", async (req, res) => {
  const {
    firstName,
    middleName,
    lastName,
    sex,
    phoneNumber,
    username,
    email,
    password,
    prc,
  } = req.body;

  const existingUser = await userModel.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists!" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const userCount = await userModel.countDocuments();
  const medtechID = userCount + 1;
  const newUser = new userModel({
    medtechID: medtechID,
    name: `${lastName}, ${firstName} ${middleName}`,
    username,
    email,
    phoneNo: phoneNumber,
    sex,
    password: hashedPassword,
    prcno: prc,
    isMedtech: !!prc,
  });
  await newUser.save();
  res.status(201).json({ message: "User registered successfully!" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await userModel.findOne({ username });
  //console.log(user);
  if (!user) {
    return res.status(400).json({ message: "Account does not exist" });
  }
  const isPasswordIncorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordIncorrect) {
    return res.status(400).json({ message: "Incorrect password" });
  }
  req.session.ID = req.sessionID;
  req.session.medtechID = user.medtechID;
  if (req.body.remember) {
    req.session.cookie.maxAge = 21 * 24 * 60 * 60 * 1000;
  } else {
    req.session.cookie.expires = false;
  }
  res.status(200).json("Login successful!");
});

app.get('/api/user', (req, res) => {
  if (req.session.medtechID) {
    // Fetch the user details based on medtechID stored in the session
    userModel.findOne({ medtechID: req.session.medtechID })
      .then(user => {
        if (user) {
          return res.json({ medtechID: user.medtechID });
        } else {
          return res.status(404).json({ message: "User not found" });
        }
      })
      .catch(err => {
        console.error("Error fetching user", err);
        res.status(500).json({ message: "Internal server error" });
      });
  } else {
    res.status(401).json({ message: "User not logged in" });
  }
});


app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    res.status(204).send();
  });
});

app.get("/auth", (req, res) => {
  if (req.session.ID) {
    return res.status(200).json({ isAuthenticated: true });
  } else {
    return res.status(200).json({ isAuthenticated: false });
  }
});

app.post("/addpatient", async (req, res) => {
  const {
    name,
    sex,
    birthday,
    age,
    phoneNumber,
    email,
    pwdID,
    seniorID,
    address,
    remarks,
    message,
  } = req.body;
  try {
    if (message) {
      console.log(message);
      res
        .status(400)
        .json({ message: "Failed to add patient. Please try again" });
    } else {
      //automate the patientID for the new patients
      const latestPatient = await patientModel
        .findOne({}, { patientID: 1 })
        .sort({ patientID: -1 });
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
        remarks,
      });
      await patient.save();
      res.status(201).json({ message: "Patient added successfully", patient });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding patient", error: error.message });
  }
});

app.post("/api/requests", async (req, res) => {
  try {
    const createRequest = async (requestData) => {
      try {
        const newRequest = new requestModel(requestData);
        await newRequest.save();
        console.log("Request created:", newRequest);
      } catch (error) {
        console.error("Error creating request:", error);
        throw error;
      }
    };
    const createTest = async (testData, category) => {
      try {
        const modelMap = {
          //model based on the category
          Hematology: hematologyModel,
          "Clinical Microscopy": clinicalMicroscopyModel,
          Chemistry: chemistryModel,
          Serology: serologyModel,
        };

        const Model = modelMap[category];
        if (Model) {
          const newTest = new Model(testData);
          await newTest.save();
          console.log("Test created:", newTest);
        } else {
          console.log("Error in Creating a Request");
        }
      } catch (error) {
        console.error("Error creating request:", error);
        throw error;
      }
    };

    const latestDocument = await requestModel.findOne({}, null, {
      sort: { requestID: -1 },
    });
    const latestId = latestDocument ? latestDocument.requestID : 1000;
    let newReqId = latestId + 1; // Get new secondary id

    const currentDate = new Date(); // Get the current date

    const { tests, patientID, payment } = req.body;

    const requests = {
      //  preparation for grouping tests later
      Hematology: [],
      "Clinical Microscopy": [],
      Chemistry: [],
      Serology: [],
    };

    for (const [test, category] of Object.entries(tests)) {
      //  bin every test to their corresponding category
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
      if (tests.length > 0) {
        //  if the category has tests
        const stringTests = tests.join(", ");
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
          payStatus: payment,
        });

        // create the new test for every test in tests
        let newTest = {
          requestID: newReqId,
        };
        for (const test of tests) {
          if (category == "Hematology") {
            switch (test) {
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
              case "Bleeding Time":
                newTest.bleedingTime = -1;
                break;
              default:
                console.log("Unknown test key: ", test);
                break;
            }
          } else if (category == "Clinical Microscopy") {
            newTest.color = "";
            newTest.bacteria = "";
            newTest.rbc = -1;
            newTest.pus = -1;
            switch (test) {
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
                newTest.fobt = -1;
                break;
              default:
                console.log("Unknown test key: ", test);
                break;
            }
          } else if (category == "Chemistry") {
            switch (test) {
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
          } else if (category == "Serology") {
            switch (test) {
              case "HbsAg":
                newTest.hbsAg = "";
                break;
              case "RPR or VDRL":
                newTest.rPROrVdrl = "";
                break;
              case "Pregnancy Test Serum":
                newTest.pregnancyTestSerum = "";
                break;
              case "Pregnancy Test Urine":
                newTest.pregnancyTestUrine = "";
                break;
              case "Dengue NS1":
                newTest.dengueNs1 = "";
                break;
              case "Dengue Duo":
                newTest.dengueDuo = "";
                break;
              default:
                console.log("Unknown test key: ", test);
                break;
            }
          } else {
            console.log("Error in Creating a Request: ", category);
          }
        }
        await createTest(newTest, category);
        newReqId++; //  increment internal counter for request ID
      }
    }
    res.status(201).json({
      message: "Requests created successfully with latest ID",
      newReqId,
    }); // Respond with success message
  } catch (error) {
    console.error("Failed to create request:", error);
    res.status(500).json({ error: "Failed to create request" }); // Respond with an error message
  }
});

app.put("/api/requests/:requestID", async (req, res) => {
  const { requestID } = req.params;
  const { status, payStatus, remarks, medtechID } = req.body;

  console.log(status, payStatus, remarks, medtechID);

  try {
    // console.log("Received PUT request to update requestID:", requestID);
    // console.log("New data:", { status, payStatus, remarks });

    const updateData = {};

    // Conditionally add `status` to `updateData` if it is not null
    if (status !== undefined) {
      updateData.status = status;

      // Handle `dateEnd` based on `status`
      if (status === "Completed") {
          updateData.dateEnd = new Date(); // Set dateEnd to current date if status is "Completed"
      } else {
          updateData.dateEnd = null; // Remove dateEnd for other statuses
      }
    }
    
    // Conditionally add `payStatus` and `remarks` if they are not null
    if (payStatus !== undefined) {
        updateData.payStatus = payStatus;
    }
    if (remarks !== undefined) {
        updateData.remarks = remarks;
    }
    if (medtechID !== undefined) {
      updateData.medtechID = medtechID;
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

app.post("/testvalues", async (req, res) => {
  const data = req.body;
  console.log("Request Body:", data);
  console.log("Updating document with requestID:", data.requestID);
  try {
    const models = {
      Hematology: hematologyModel,
      "Clinical Microscopy": clinicalMicroscopyModel,
      Chemistry: chemistryModel,
      Serology: serologyModel,
    };

    const Model = models[data.category];
    const updatedRequest = await Model.findOneAndUpdate(
      // Filter for the document to update
      { requestID: data.requestID },
      { $set: data },
      { new: true }
    );
    console.log(updatedRequest);
    if (updatedRequest) {
      res.status(200).json({ message: "Test values updated successfully!" });
    } else {
      res
        .status(404)
        .json({ message: "Document not found, no update performed." });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (err) {
    console.error("Error updating request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/testoptions", async (req, res) => {
  try {
    const testOptions = await testOptionsModel.find();
    res.json(testOptions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/tests", async (req, res) => {
  try {
    const allTests = await allTestModel.find();
    res.json(allTests);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post('/generate-pdf', async (req, res) => {
  //console.log('Received data:', req.body);  
  const dir = '../Client/src/assets/PDFTemplates/';

  const request = await requestModel.findOne({ requestID: req.body.requestID });
  const patient = await patientModel.findOne({ patientID: request.patientID });
  const physician = await userModel.findOne({ medtechID: request.medtechID });

  let requestName = req.body.requestName;
  let physName = physician.name;
  let requestAge = patient.age;
  let requestSex = patient.sex;

  if(req.body.category == 'Hematology'){
    let hemoglobin = req.body.hemoglobin;
    let hematocrit = req.body.hematocrit;
    let rbcCount = req.body.rbcCount;
    let wbcCount = req.body.wbcCount;
    let neutrophil = req.body.neutrophil;
    let lymphocyte = req.body.lymphocyte;
    let monocyte = req.body.monocyte;
    let eosinophil = req.body.eosinophil;
    let basophil = req.body.basophil;
    let withPlateletCount = req.body.plateletCount;
    let plateletCount = req.body.plateletCount;
    let esr = req.body.esr;
    let bloodWithRh = req.body.bloodWithRh;
    let clottingTime = req.body.clottingTime;
    let bleedingTime = req.body.bleedingTime;

    try {
      const pdfDoc = await PDFDocument.load(await fs.readFile(dir + 'HematologyTemplate.pdf'));
      const form = pdfDoc.getForm();
      const fields = form.getFields();

      const timesNewRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

      const today = new Date();

      let month = today.getMonth() + 1;
      let day = today.getDate();
      let year = today.getFullYear();
      
      form.getTextField('Name').setText(requestName.toUpperCase());
      form.getTextField('Name').defaultUpdateAppearances(timesBold);
      form.getTextField('Age/Sex').setText(requestAge + "/" + requestSex);
      form.getTextField('Date').setText(month+ "/" + day + "/" + year);

      form.getTextField('Physician').setText(physName);
      // Set values for specific fields by their names
      form.getTextField('Hemoglobin').setText(String(hemoglobin === -1 ? '' : hemoglobin || ''));
      form.getTextField('Hematocrit').setText(String(hematocrit === -1 ? '' : hematocrit || ''));
      form.getTextField('RBC Count').setText(String(rbcCount === -1 ? '' : rbcCount || ''));
      form.getTextField('WBC Count').setText(String(wbcCount === -1 ? '' : wbcCount || ''));
      form.getTextField('Neutrophil').setText(String(neutrophil === -1 ? '' : neutrophil || ''));
      form.getTextField('Lymphocyte').setText(String(lymphocyte === -1 ? '' : lymphocyte || ''));
      form.getTextField('Eosinophil').setText(String(eosinophil === -1 ? '' : eosinophil || ''));
      form.getTextField('Basophil').setText(String(basophil === -1 ? '' : basophil || ''));
      form.getTextField('Monocyte').setText(String(monocyte === -1 ? '' : monocyte || ''));
      form.getTextField('Platelet Count').setText(String(plateletCount === -1 ? '' : plateletCount || ''));


// DEV NOTE: NEED TO UPDATE PDF, NO ESR, BLOODWITHRH, CLOTTING TIME, BLEEDING TIME

      fields.forEach(field => {
          field.defaultUpdateAppearances(timesBold, '/F1 13 Tf 0 g');
      });

      form.getTextField('Age/Sex').updateAppearances(timesNewRoman);
      form.getTextField('Date').updateAppearances(timesNewRoman);
      form.getTextField('Physician').updateAppearances(timesNewRoman);

      // Flatten the form to make fields non-editable and set appearances
      form.flatten();

      // Save the filled and flattened PDF
      const pdfBytes = await pdfDoc.save();

      // Set response to download the generated PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=Result_test.pdf`);
      res.send(Buffer.from(pdfBytes));

      console.log('PDF generated successfully');  // Log successful generation
    } catch (error) {
      console.log('Error generating PDF:', error);  // Log any errors
      res.status(500).send('Error generating PDF');
    }
  }

  if(req.body.category == 'Clinical Microscopy'){
    // Common fields
    let color = req.body.color;
    let bacteria = req.body.bacteria;
    let rbc = req.body.rbc;
    let pus = req.body.pus;

    // Urinalysis-specific fields
    let transparency = req.body.transparency;
    let pH = req.body.pH;
    let specificGravity = req.body.specificGravity;
    let sugar = req.body.sugar;
    let protein = req.body.protein;
    let epithelialCells = req.body.epithelialCells;
    let mucusThread = req.body.mucusThread;

    // Fecalysis-specific fields
    let consistency = req.body.consistency;
    let wbc = req.body.wbc;
    let ovaParasite = req.body.ovaParasite;
    let fatGlobule = req.body.fatGlobule;
    let bileCrystal = req.body.bileCrystal;
    let vegetableFiber = req.body.vegetableFiber;
    let meatFiber = req.body.meatFiber;
    let erythrocyte = req.body.erythrocyte;
    let yeastCell = req.body.yeastCell;

    try {
      const pdfDoc = await PDFDocument.load(await fs.readFile(dir + 'ClinicalMicroscopyTemplate.pdf'));
      const form = pdfDoc.getForm();
      const fields = form.getFields();

      const timesNewRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

      const today = new Date();

      let month = today.getMonth() + 1;
      let day = today.getDate();
      let year = today.getFullYear();
      
      form.getTextField('Name').setText(requestName.toUpperCase());
      form.getTextField('Name').defaultUpdateAppearances(timesBold);
      form.getTextField('AgeSex').setText(requestAge + "/" + requestSex);
      form.getTextField('Date').setText(month+ "/" + day + "/" + year);

      form.getTextField('Physician').setText(physName);
      if (transparency || pH || specificGravity) {
        form.getTextField('Color_Urinal').setText(String(color === -1 ? '' : color || ''));
        form.getTextField('Pus_Urinal').setText(String(pus === -1 ? '' : pus || ''));
        form.getTextField('RBC_Urinal').setText(String(rbc === -1 ? '' : rbc || ''));
        form.getTextField('Bacteria_Urinal').setText(String(bacteria === -1 ? '' : bacteria || ''));
        form.getTextField('Transparency').setText(String(transparency === -1 ? '' : transparency || ''));
        form.getTextField('pH').setText(String(pH === -1 ? '' : pH || ''));
        form.getTextField('Specific_Gravity').setText(String(specificGravity === -1 ? '' : specificGravity || ''));
        form.getTextField('Sugar').setText(String(sugar === -1 ? '' : sugar || ''));
        form.getTextField('Protein').setText(String(protein === -1 ? '' : protein || ''));
        form.getTextField('Epithelial_Cells').setText(String(epithelialCells === -1 ? '' : epithelialCells || ''));
        form.getTextField('Mucus_Thread').setText(String(mucusThread === -1 ? '' : mucusThread || ''));
      } else if (consistency || ovaParasite || bileCrystal || vegetableFiber || meatFiber || erythrocyte || yeastCell) {
// DEV NOTES: TWO PUS FIELDS, NO WBC FIELD IN FECALYSIS
        
        form.getTextField('Color_Fecal').setText(String(color === -1 ? '' : color || ''));
        form.getTextField('Pus_Fecal').setText(String(pus === -1 ? '' : pus || ''));
        form.getTextField('RBC_Fecal').setText(String(rbc === -1 ? '' : rbc || ''));
        form.getTextField('Bacteria_Fecal').setText(String(bacteria === -1 ? '' : bacteria || ''));
        form.getTextField('Consistency').setText(String(consistency === -1 ? '' : consistency || ''));
        form.getTextField('Ova').setText(String(ovaParasite === -1 ? '' : ovaParasite || ''));
        form.getTextField('Fat_Globule').setText(String(fatGlobule === -1 ? '' : fatGlobule || ''));
        form.getTextField('Bile_Crystal').setText(String(bileCrystal === -1 ? '' : bileCrystal || ''));
        form.getTextField('Vegetable_Fiber').setText(String(vegetableFiber === -1 ? '' : vegetableFiber || ''));
        form.getTextField('Meat_Fiber').setText(String(meatFiber === -1 ? '' : meatFiber || ''));
        form.getTextField('Pus_Cells').setText(String(pus === -1 ? '' : pus || '')); // Redundant field?
        form.getTextField('Erythrocyte').setText(String(erythrocyte === -1 ? '' : erythrocyte || ''));
        form.getTextField('Yeast_Cells').setText(String(yeastCell === -1 ? '' : yeastCell || ''));
      }
    

      fields.forEach(field => {
          field.defaultUpdateAppearances(timesBold, '/F1 13 Tf 0 g');
      });

      form.getTextField('AgeSex').updateAppearances(timesNewRoman);
      form.getTextField('Date').updateAppearances(timesNewRoman);
      form.getTextField('Physician').updateAppearances(timesNewRoman);

      // Flatten the form to make fields non-editable and set appearances
      form.flatten();

      // Save the filled and flattened PDF
      const pdfBytes = await pdfDoc.save();

      // Set response to download the generated PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=Result_test.pdf`);
      res.send(Buffer.from(pdfBytes));

      console.log('PDF generated successfully');  // Log successful generation
    } catch (error) {
      console.log('Error generating PDF:', error);  // Log any errors
      res.status(500).send('Error generating PDF');
    }
  }

  if(req.body.category == 'Chemistry'){
    let fbs = req.body.fbs;
    let rbs = req.body.rbs;
    let creatinine = req.body.creatinine;
    let uricAcid = req.body.uricAcid;
    let cholesterol = req.body.cholesterol;
    let triglycerides = req.body.triglycerides;
    let hdl = req.body.hdl;
    let ldl = req.body.ldl;
    let vldl = req.body.vldl;
    let bun = req.body.bun;
    let sgpt = req.body.sgpt;
    let sgot = req.body.sgot;
    let hba1c = req.body.hba1c;

    try {
      const pdfDoc = await PDFDocument.load(await fs.readFile(dir + 'ChemistryTemplate.pdf'));
      const form = pdfDoc.getForm();
      const fields = form.getFields();

      const timesNewRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

      const today = new Date();

      let month = today.getMonth() + 1;
      let day = today.getDate();
      let year = today.getFullYear();
      
      form.getTextField('Name').setText(requestName.toUpperCase());
      form.getTextField('Name').defaultUpdateAppearances(timesBold);
      form.getTextField('AgeSex').setText(requestAge + "/" + requestSex);
      form.getTextField('Date').setText(month+ "/" + day + "/" + year);

      form.getTextField('Physician').setText(physName);
      // Set values for specific fields by their names
      form.getTextField('FBS').setText(String(fbs === -1 ? '' : fbs || ''));
      form.getTextField('RBS').setText(String(rbs === -1 ? '' : rbs || ''));
      form.getTextField('Creatinine').setText(String(creatinine === -1 ? '' : creatinine || ''));
      form.getTextField('Uric_Acid').setText(String(uricAcid === -1 ? '' : uricAcid || ''));
      form.getTextField('Cholesterol_Total').setText(String(cholesterol === -1 ? '' : cholesterol || ''));
      form.getTextField('Triglycerides').setText(String(triglycerides === -1 ? '' : triglycerides || ''));
      form.getTextField('Cholesterol_HDL').setText(String(hdl === -1 ? '' : hdl || ''));
      form.getTextField('Cholesterol_LDL').setText(String(ldl === -1 ? '' : ldl || ''));
      form.getTextField('VLDL').setText(String(vldl === -1 ? '' : vldl || ''));
      form.getTextField('BUN').setText(String(bun === -1 ? '' : bun || ''));
      form.getTextField('SGPT').setText(String(sgpt === -1 ? '' : sgpt || ''));
      form.getTextField('SGOT').setText(String(sgot === -1 ? '' : sgot || ''));
      form.getTextField('HBA1C').setText(String(hba1c === -1 ? '' : hba1c || ''));

      fields.forEach(field => {
          field.defaultUpdateAppearances(timesBold, '/F1 13 Tf 0 g');
      });

      form.getTextField('AgeSex').updateAppearances(timesNewRoman);
      form.getTextField('Date').updateAppearances(timesNewRoman);
      form.getTextField('Physician').updateAppearances(timesNewRoman);

      // Flatten the form to make fields non-editable and set appearances
      form.flatten();

      // Save the filled and flattened PDF
      const pdfBytes = await pdfDoc.save();

      // Set response to download the generated PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=Result_test.pdf`);
      res.send(Buffer.from(pdfBytes));

      console.log('PDF generated successfully');  // Log successful generation
    } catch (error) {
      console.log('Error generating PDF:', error);  // Log any errors
      res.status(500).send('Error generating PDF');
    }
  }

  if(req.body.category == 'Serology'){
    let hbsAg = req.body.hbsAg;
    let rprVdrl = req.body.rprOrVdrl;
    let pregnancyTestSerum = req.body.pregnancyTestSerum;
    let pregnancyTestUrine = req.body.pregnancyTestUrine;
    let dengueNs1 = req.body.dengueNs1;
    let dengueDuo = req.body.dengueDuo;

    try {
      const pdfDoc = await PDFDocument.load(await fs.readFile(dir + 'SerologyTemplate.pdf'));
      const form = pdfDoc.getForm();
      const fields = form.getFields();

      const timesNewRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

      const today = new Date();

      let month = today.getMonth() + 1;
      let day = today.getDate();
      let year = today.getFullYear();
      
      form.getTextField('Name').setText(requestName.toUpperCase());
      form.getTextField('Name').defaultUpdateAppearances(timesBold);
      form.getTextField('AgeSex').setText(requestAge + "/" + requestSex);
      form.getTextField('Date').setText(month+ "/" + day + "/" + year);

      form.getTextField('Physician').setText(physName);
      // Set values for specific fields by their names
      form.getTextField('HbsAg').setText(hbsAg);
      form.getTextField('RPR').setText(rprVdrl);
      form.getTextField('Serum').setText(pregnancyTestSerum);
      form.getTextField('Urine').setText(pregnancyTestUrine);
      form.getTextField('NS1').setText(dengueNs1);
      form.getTextField('Duo').setText(dengueDuo);

      fields.forEach(field => {
          field.defaultUpdateAppearances(timesBold, '/F1 13 Tf 0 g');
      });

      form.getTextField('AgeSex').updateAppearances(timesNewRoman);
      form.getTextField('Date').updateAppearances(timesNewRoman);
      form.getTextField('Physician').updateAppearances(timesNewRoman);

      // Flatten the form to make fields non-editable and set appearances
      form.flatten();

      // Save the filled and flattened PDF
      const pdfBytes = await pdfDoc.save();

      // Set response to download the generated PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=Result_test.pdf`);
      res.send(Buffer.from(pdfBytes));

      console.log('PDF generated successfully');  // Log successful generation
    } catch (error) {
      console.log('Error generating PDF:', error);  // Log any errors
      res.status(500).send('Error generating PDF');
    }
  }
  
});

// Handle the /send-pdf-email POST request
app.post("/send-pdf-email", upload.single("pdf"), async (req, res) => {
  try {
    // Access form data and the file
    const { email } = req.body;
    const formData = JSON.parse(req.body.formData); // Parse formData from string to object
    const pdfBuffer = req.file.buffer; // Access the uploaded PDF file buffer

    // Check if email and formData exist
    if (!email || !formData) {
      return res.status(400).send("Email or form data is missing.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bioscopicdiagnosticlaboratory@gmail.com",
        pass: "ceht usoq zmxc gckd",
      },
    });

    // Prepare email content and attachment
    let nameParts = formData.requestName.split(", ");
    let formattedName = nameParts[0] + nameParts[1].charAt(0); // Format the name for the attachment filename

    const mailOptions = {
      from: '"Bioscopic Diagnostic Laboratory" <bioscopicdiagnosticlaboratory@gmail.com>',
      to: email, // Send email to the recipient
      subject: `${nameParts[1]} ${nameParts[0]} ${formData.category} Test Results`,
      text: `Hello Mx. ${nameParts[0]},\n\nAttached in this email are your ${formData.category.toLowerCase()} test results.`,
      attachments: [
        {
          filename: `${formattedName}_${formData.category}.pdf`, // PDF file name
          content: pdfBuffer, // Attach the PDF file from the buffer
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email.");
  }
});

const server = app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});

module.exports = { app, server };
