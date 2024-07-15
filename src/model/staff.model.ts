import * as mongoose from 'mongoose'


export interface StaffDocument extends mongoose.Document {
    employeeID?: string;
    empName?: string;
    dob?: String;    // (Date of Birth)
    designation?: string;
    doj?: String; // (Date of Joining)
    reportingManager?: string;
    shiftTiming?: string; // (Attendance to be calculated based on this)
    probationDuration?: string;
    email?: string;
    mobileNumber?: number;  //a
    emergencyContactNo?: number;   //a
    address?: string;
    idCard?: boolean;    // – Yes / No (If ‘Yes’ card to be generated)
    privileges?: string;
    
  // Extra Fields  
    photo?: string;
    jobDescription?: string;
    areTheyEligibleForCasualLeave?: boolean; // – Yes/No (Yes – Casual to be considered | No – Casual leave restricted)
    salary?: string    // (Break Up with deduction – Manual)
    manageApplications?: string;   // Yes/No
    //If Yes, List Country & University The user can only handle applications of these universities and country
    activeInactive?:string;   // – User
    teamLead?: string;     // – Select Employees and permission to be viewed.
    password?: string;
    confirmPassword?: string;
    isDeleted?: boolean;
  

// Newly added fields
    team?: string;
    address2?: string;
    pin?: number;
    country?: string;
    state?: string;
    city?: string;
    status?: string;
    companyAssests?: string;
    mobileName?: string;
    brandName?: string;
    IMEI?: string;
    phoneNumber?: number;
    laptopName?: string;
    brand?: string;
    modelName?: string;
    ipAddress?: string;
    userName?: string;
    loginPassword?: string;
    
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const staffSchema = new mongoose.Schema({
    employeeID: {type: String},
    photo: {type: String},
    empName: {type: String},
    designation: {type: String},
    jobDescription: {type: String},
    reportingManager: {type: String},
    shiftTiming: {type: String},                        // (Attendance to be calculated based on this)
    areTheyEligibleForCasualLeave: {type: String},           // – Yes/No (Yes – Casual to be considered | No – Casual leave restricted)
    doj: {type: String},                    // (Date of Joining)
    dob: {type: String},                     // (Date of Birth)
    address: {type: String},
    email: {type: String},
    mobileNumber: {type: Number},
    emergencyContactNo: {type: Number},
    probationDuration: {type: String},
    salary: {type: String},               // (Break Up with deduction – Manual)        
    idCard: {type: String},                     // – Yes / No (If ‘Yes’ card to be generated)
    manageApplications: {type: String},           // Yes/No    //If Yes, List Country & University The user can only handle applications of these universities and country
    activeInactive: {type: String},                // – User
    teamLead: {type: String},   
    password: { type: String },
    confirmPassword: { type: String },  
    isDeleted: { type: Boolean, default: false },
    privileges: {type: String},  //(To be assigned by Super Admin)
    
    // Newly added fields
    team: {type: String},
    address2:  { type: String },
    pin:  { type: Number },
    country:  { type: String },
    state: { type: String },
    city:  { type: String },
    status: { type: String },
    companyAssests:  { type: String },
    mobileName:  { type: String },
    brandName:  { type: String },
    IMEI: { type: String },
    phoneNumber:  { type: Number },
    laptopName: { type: String },
    brand:  { type: String },
    modelName:  { type: String },
    ipAddress: { type: String },
    userName:  { type: String },
    loginPassword:  { type: String },


    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})
export const Staff = mongoose.model('Staff', staffSchema)