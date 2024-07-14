import * as mongoose from 'mongoose'


export interface ClientDocument extends mongoose.Document {
    _id?: any;
    typeOfClient?: string;    // - Institution, Financial Institution, Other Service Provider
    businessName?: string;
    clientID?: string;
    clientStatus?: string;
    businessMailID?: string;
    businessContactNo?: number;  //a
    website?: string;
    addressLine1?: string;
    name?: string;
    country?: string;
    state?: string;
    lga?: string;
    
    contactNo?: number;   //a
    emailID?: string;
    addressLine2?: string;
    addressLine3?: string;      // Street Address, City, State, Postal Code, Country
    whatsAppNumber?: string;
    staffStatus?: string;     // (Active/Inactive)
    isDeleted?: boolean;
    privileges?: string;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}


const clientSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    clientID: { type: String },
    typeOfClient: { type: String },  // - Institution, Financial Institution, Other Service Provider
    businessName: { type: String },
    clientStatus: { type: String },
    businessMailID: { type: String },
    businessContactNo: { type: Number },
    website: { type: String },
    addressLine1: { type: String }, // No Street Address, 
    addressLine2: { type: String },// , City, State, 
    addressLine3: { type: String },   //  Postal Code, Country
    name: { type: String },
    country: { type: String },
    state: { type: String },
    lga: { type: String },
    contactNo: { type: Number },
    emailID: { type: String },
    whatsAppNumber: { type: String },
    staffStatus: { type: String },    // (Active/Inactive)
    isDeleted: { type: Boolean, default: false },
    privileges: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },

})


export const Client = mongoose.model("Client", clientSchema)