const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        medtechID: { type: Number },
        name: { type: String },
        username: { type: String },
        email: { type: String },
        phoneNo: { type: String },
        sex: { type: String },
        password: { type: String },
        prcno: { type: String },
        isMedtech: { type: Boolean },
    },
    { versionKey: false }
);

const userModel = mongoose.model("users", userSchema);

const patientSchema = new mongoose.Schema(
    {
        patientID: { type: Number },
        name: { type: String },
        sex: { type: String },
        birthday: { type: Date },
        age: { type: Number },
        phoneNo: { type: String },
        email: { type: String },
        pwdID: { type: String },
        seniorID: { type: String },
        address: { type: String },
        remarks: { type: String },
    },
    { versionKey: false }
);

const patientModel = mongoose.model("patients", patientSchema);

const requestSchema = new mongoose.Schema(
    {
        requestID: { type: Number },
        patientID: { type: Number },
        medtechID: { type: Number },
        category: { type: String },
        test: { type: String },
        status: { type: String },
        dateStart: { type: Date },
        dateEnd: { type: Date },
        remarks: { type: String },
        payStatus: { type: String }
    },
    { versionKey: false }
);

const requestModel = mongoose.model("requests", requestSchema);

const hematologySchema = new mongoose.Schema(
    {
        requestID: { type: Number },
        hemoglobin: { type: Number },
        hematocrit: { type: Number },
        rbcCount: { type: Number },
        wbcCount: { type: Number },
        neutrophil: { type: Number },
        lymphocyte: { type: Number },
        monocyte: { type: Number },
        eosinophil: { type: Number },
        basophil: { type: Number },
        // withPlateletCount: { type: Boolean },
        plateletCount: {
            type: Number
            // validate: {
            //     validator: function () {
            //         return this.withPlateletCount ? this.plateletCount != null : true;
            //     },
            //     message: "plateletCount is required if withPlateletCount is true",
            // },
        },
        esr: { type: Number },
        bloodWithRh: { type: Number },
        clottingTime: { type: Number },
        bleedingTime: { type: Number },
    },
    { versionKey: false },
    { discriminatorKey: "type" }
);

const clinicalMicroscopySchema = new mongoose.Schema(
    {
        requestID: { type: Number, required: true },
        // Common fields
        color: { type: String },
        bacteria: { type: String },
        rbc: { type: Number },
        pus: { type: Number },

        // Urinalysis-specific fields
        transparency: { type: String },
        pH: { type: Number },
        specificGravity: { type: Number },
        sugar: { type: String },
        protein: { type: String },
        epithelialCells: { type: String },
        mucusThread: { type: String },

        // Fecalysis-specific fields
        consistency: { type: String },
        wbc: { type: Number },
        ovaParasite: { type: String },
        fatGlobule: { type: String },
        bileCrystal: { type: String },
        vegetableFiber: { type: String },
        meatFiber: { type: String },
        erythrocyte: { type: Number },
        yeastCell: { type: Number },
    },
    { versionKey: false, discriminatorKey: "type" }
);


const chemistrySchema = new mongoose.Schema(
    {
        requestID: { type: Number },
        fbs: { type: Number },
        rbs: { type: Number },
        creatinine: { type: Number },
        uricAcid: { type: Number },
        cholesterol: { type: Number },
        triglycerides: { type: Number },
        hdl: { type: Number },
        ldl: { type: Number },
        vldl: { type: Number },
        bun: { type: Number },
        sgpt: { type: Number },
        sgot: { type: Number },
        hba1c: { type: Number },
    },
    { versionKey: false },
    { discriminatorKey: "type" }
);

const serologySchema = new mongoose.Schema(
    {
        requestID: { type: Number },
        hbsAg: { type: String },
        rprVdrl: { type: String },
        pregnancyTestSerum: { type: String },
        pregnancyTestUrine: { type: String },
        dengueNs1: { type: String },
        dengueDuo: { type: String },
    },
    { versionKey: false },
    { discriminatorKey: "type" }
);

const baseTestSchema = new mongoose.Schema({}, { discriminatorKey: "type" });
const serologyModel = mongoose.model("serology", serologySchema, "tests");
const hematologyModel = mongoose.model("hematology", hematologySchema, "tests");
const clinicalMicroscopyModel = mongoose.model("urinalysis", clinicalMicroscopySchema, "tests");
const chemistryModel = mongoose.model("chemistry", chemistrySchema, "tests");
const allTestModel = mongoose.model("Test", baseTestSchema, "tests");

let appdata = {
    patientModel: patientModel,
    userModel: userModel,
    requestModel: requestModel,
    hematologyModel: hematologyModel,
    clinicalMicroscopyModel: clinicalMicroscopyModel,
    chemistryModel: chemistryModel,
    serologyModel: serologyModel,
    allTestModel: allTestModel,
};

module.exports.appdata = appdata;
module.exports.mongoose = mongoose;
