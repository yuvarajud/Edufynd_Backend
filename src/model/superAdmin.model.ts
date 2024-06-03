import * as mongoose from 'mongoose'


export interface SuperAdminDocument extends mongoose.Document{
    name?: string;
    email?: string;
    mobileNumber?: string;
    password?: string;
    confirmPassword?: string;
    studentId?: any;
    agentId?: any;
    isDeleted?: boolean;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const superAdminSchema = new mongoose.Schema({
    name: {type: String},
    email: { type: String},
    mobileNumber: {type: String},
    password: {type: String},
    confirmPassword: {type: String},
    studentId: { type: mongoose.Types.ObjectId, ref: 'Student' },
    agentId: { type: mongoose.Types.ObjectId, ref: 'Agent' },
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
})

export const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema)
export default SuperAdmin