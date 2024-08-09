import * as mongoose from 'mongoose'

export interface PayRollDocument extends mongoose.Document {
    _id?: any;
    // employeeId?: any;
    houseRent?: number;
    conveyance?: number;
    otherAllowance?: number;
    pf?: number;
    taxDeduction?: number;
    grossSalary?: number;
    totalDeduction?: number;
    netSalary?: number;
    uploadDocument?: string;
   // additionalComponents?: any;
 


    allowance?: any[];
    deduction?: any[];
  
    //staff Details
    empName?: string;
    staffId?: string;
    employeeId?: string;
    reportingManager?: string;
    photo?: string;
    email?: string;
    mobileNumber: number;
    designation: string;
    description: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

export const payRollSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    // employeeId: { type: mongoose.Types.ObjectId, ref: 'Staff' },
    houseRent: { type: Number },
    conveyance: { type: Number },
    otherAllowance: { type: Number },
    pf: { type: Number },
    taxDeduction: { type: Number },
    grossSalary: { type: Number },
    totalDeduction: { type: Number },
    netSalary: { type: Number },
    uploadDocument: { type: String },
    allowance: [{
        name: {type: String},
        amount: {type:Number}
    }],
    deduction: [{
        title: {type: String},
        amount: {type:Number}
    }],

    //staff Details
    empName: { type: String },
    staffId: { type: String },
    employeeId: { type: String },
    reportingManager: { type: String },
    photo: { type: String },
    email: { type: String },
    mobileNumber: { type: Number },
    designation: { type: String },
    description:{ type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})

export const PayRoll = mongoose.model("PayRoll", payRollSchema)