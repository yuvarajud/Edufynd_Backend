import { Applicant, ApplicantDocument } from '../model/application.model'
import { Student, StudentDocument } from '../model/student.model'
import { University, UniversityDocument } from '../model/university.model'
import { validationResult } from "express-validator";
import { response, transporter } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { Error } from 'mongoose';
import * as config from '../config';


var activity = "Applicant";



export let getAllApplicant = async (req, res, next) => {
    try {
        const data = await Applicant.find({ isDeleted: false }).sort({ applicationCode: -1 });
        response(req, res, activity, 'Level-1', 'GetAll-Applicant', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Applicant', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleApplicant = async (req, res, next) => {
    try {
        const applicant = await Applicant.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-Applicant', true, 200, applicant, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-Applicant', false, 500, {}, errorMessage.internalServer, err.message);
    }
}



const generateNextApplicationCode = async () => {
    // Retrieve all applicant IDs to determine the highest existing applicant counter
    const applicant = await Applicant.find({}, 'applicationCode').exec();
    const maxCounter = applicant.reduce((max, app) => {
        const appCode = app.applicationCode;
        const parts = appCode.split('_')
        if (parts.length === 2) {
            const counter = parseInt(parts[1], 10)
            return counter > max ? counter : max;
        }
        return max;
    }, 100);

    // Increment the counter
    const newCounter = maxCounter + 1;
    // Format the counter as a string with leading zeros
    const formattedCounter = String(newCounter).padStart(3, '0');
    // Return the new Applicantion Code
    return `AP_${formattedCounter}`;
};


export let createApplicant = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const applicantDetails: ApplicantDocument = req.body;
            // Generate the next client ID
            applicantDetails.applicationCode = await generateNextApplicationCode();
            const createData = new Applicant(applicantDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Save-Applicant', 'Level-2', true, 200, insertData, clientError.success.application);
        } catch (err: any) {
            console.log(err)
            response(req, res, activity, 'Save-Applicant', 'Level-3', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Save-Applicant', 'Level-3', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


// export let createApplicant = async (req, res, next) => {
//     console.log("bbb")
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try {
//             const studentDetails: StudentDocument = req.body;
//             const universityDetails: UniversityDocument = req.body;

//             const applicant = await Student.findOne({ $and: [{ isDeleted: false }, { email: studentDetails.email }] });

//             const university = await University.findOne({ $and: [{ isDeleted: false }, { universityId: universityDetails._id }] });

//             if (applicant) {
//                 const applicantDetails: ApplicantDocument = req.body;

//                  applicantDetails.applicationCode = await generateNextApplicationCode();

//                 const createData = new Applicant(applicantDetails);
//                 let insertData = await createData.save();

//                 const studentData = {}
//                 studentData['name'] = applicant.name
//                 studentData['email'] = applicant.email

//                 const universityData = {}
//                 universityData['_id'] = university._id
//                 universityData['universityName'] = university.universityName

//                 const final = { studentData, universityData }
//                 response(req, res, activity, 'Level-2', 'Save-Applicant', true, 200, final, clientError.success.application);
//             }
//             else {
//                 response(req, res, activity, 'Level-3', 'Save-Applicant', true, 422, {}, 'No email Id found');
//             }

//         } catch (err: any) {
// console.log(err)
//             response(req, res, activity, 'Level-3', 'Save-Applicant', false, 500, {}, errorMessage.internalServer, err.message);
//         }
//     }
//     else {
//         response(req, res, activity, 'Level-3', 'Save-Applicant', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
//     }
// }



// export let updateApplicant = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try {
//             const applicantDetails: ApplicantDocument = req.body;
//             let applicantData = await Applicant.findByIdAndUpdate({ _id: applicantDetails._id }, {
//                 $set: {
//                     applicationCode: applicantDetails.applicationCode,
//                     name: applicantDetails.name,
//                     dob: applicantDetails.dob,
//                     passportNo: applicantDetails.passportNo,
//                     email: applicantDetails.email,
//                     primaryNumber: applicantDetails.primaryNumber,
//                     whatsAppNumber: applicantDetails.whatsAppNumber,
//                     inTake: applicantDetails.inTake,
//                     universityName: applicantDetails.universityName,
//                     campus: applicantDetails.campus,
//                     course: applicantDetails.course,
//                     courseFees: applicantDetails.courseFees,
//                     anyVisaRejections: applicantDetails.anyVisaRejections,
//                     feesPaid: applicantDetails.feesPaid,
//                     assignTo: applicantDetails.assignTo,

//                     status: applicantDetails.status,
//                     modifiedOn: new Date(),
//                     modifiedBy: applicantDetails.modifiedBy,
//                 }
//             });

//             response(req, res, activity, 'Level-2', 'Update-Applicant', true, 200, applicantData, clientError.success.updateSuccess);
//         } catch (err: any) {
//             response(req, res, activity, 'Level-3', 'Update-Applicant', false, 500, {}, errorMessage.internalServer, err.message);
//         }
//     }
//     else {
//         response(req, res, activity, 'Level-3', 'Update-Applicant', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
//     }
// }

export let updateApplicant = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const applicantDetails: ApplicantDocument = req.body;
            const applicant = await Applicant.findOne({ $and: [{ _id: { $ne: applicantDetails._id }, }, { email: applicantDetails.email }] });
            if (!applicant ) {
                const updateApplicant = new Applicant(applicantDetails)
                let insertMaster = await updateApplicant.updateOne({
                $set: {
                    name: applicantDetails.name,
                    dob: applicantDetails.dob,
                    passportNo: applicantDetails.passportNo,
                    email: applicantDetails.email,
                    primaryNumber: applicantDetails.primaryNumber,
                    whatsAppNumber: applicantDetails.whatsAppNumber,
                    inTake: applicantDetails.inTake,
                    universityName: applicantDetails.universityName,
                    campus: applicantDetails.campus,
                    course: applicantDetails.course,
                    courseFees: applicantDetails.courseFees,
                    anyVisaRejections: applicantDetails.anyVisaRejections,
                    feesPaid: applicantDetails.feesPaid,
                    assignTo: applicantDetails.assignTo,
                    modifiedOn: new Date(),
                    modifiedBy: applicantDetails.modifiedBy,
                },
                    $addToSet: {
                    status: applicantDetails.status,
                 
                }
            });

            response(req, res, activity, 'Level-2', 'Update-Applicant', true, 200, insertMaster, clientError.success.updateSuccess);
        }
     } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Applicant', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-Applicant', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}


// export let updateApplicantStatus = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//         try {
//             const applicantDetails: ApplicantDocument = req.body;
//             const application = await Applicant.findOne({ _id: req.body._id })
//             console.log("gf", application)
//             if (application) {
//                 const masterData = await Applicant.findByIdAndUpdate(
//                     { _id: applicantDetails._id }, // find Master id 
//                     {$set:{
//                         'status.$[ele].newStatus': applicantDetails.status.newStatus,
//                         'status.$[ele].commentBox': applicantDetails.status.commentBox,
                    
//                       }},
//                     {
//                         arrayFilters: [{ 'ele._id': applicantDetails.status._id },],//find array index filter concept
//                         new: true
//                     }
//                 );
//                 const updatedStatus = masterData.status.find(status => status._id.toString() === applicantDetails.status._id);
//                 const mailOptions = {
//                     from: config.SERVER.EMAIL_USER,
//                     to: application.email,
//                     subject: 'Welcome to EduFynd',
//                     text: `Hello ${application.name},\n\nYour Application Status has been Updated\n\nCurrent Status: ${application.status.newStatus}.
//                     \nThis Information for Your Refernece.\n\nBest regards\nAfynd Private Limited\nChennai.`
//                 };
    
//                 transporter.sendMail(mailOptions, (error, info) => {
    
//                     if (error) {
//                         console.error('Error sending email:', error);
//                         return res.status(500).json({ message: 'Error sending email' });
//                     } else {
//                         console.log('Email sent:', info.response);
//                         res.status(201).json({ message: 'Application Status has been Updated and Send Email', Details: application });
//                     }
//                 });
    
//                 response(req, res, activity, 'Level-2', 'Update-Applicant Status', true, 200, masterData, 'Successfully Add Status and Mail Send Successfully');
//             }
//             else {
//                 response(req, res, activity, 'Level-2', 'Update-Applicant Status', true, 200, {}, 'Applicant NOt Found');
//             }
//         }
//         catch (err: any) {
//             response(req, res, activity, 'Level-3', 'Update-Applicant Status', false, 500, {}, errorMessage.internalServer, err.message);
//         }
//     } else {
//         response(req, res, activity, 'Level-3', 'Update-Applicant Status', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
//     }
// }


export let updateApplicantStatus = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const applicantDetails = req.body;
            const application = await Applicant.findOne({ _id: req.body._id });
            console.log("Application found:", application);

            if (application) {
                const masterData = await Applicant.findByIdAndUpdate(
                    { _id: applicantDetails._id }, // Find the document by _id
                    {
                        $set: {
                            'status.$[ele].newStatus': applicantDetails.status.newStatus,
                            'status.$[ele].commentBox': applicantDetails.status.commentBox,
                        }
                    },
                    {
                        arrayFilters: [{ 'ele._id': applicantDetails.status._id }], // Find the correct array element by its _id
                        new: true  // Return the updated document
                    }
                );

                // Find the updated status in the array
                const updatedStatus = masterData.status.find(status => status._id.toString() === applicantDetails.status._id);

                const mailOptions = {
                    from: config.SERVER.EMAIL_USER,
                    to: application.email,
                    subject: 'Welcome to EduFynd',
                    text: `Hello ${application.name},\n\nYour Application Status has been Updated\n\nCurrent Status: ${updatedStatus.newStatus}.
                    \nThis Information is for Your Reference.\n\nBest regards,\nAfynd Private Limited,\nChennai.`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                        return res.status(500).json({ message: 'Error sending email' });
                    } else {
                        console.log('Email sent:', info.response);
                        res.status(201).json({ message: 'Application Status has been Updated and Email Sent', Details: masterData });
                    }
                });

                response(req, res, activity, 'Level-2', 'Update-Applicant Status', true, 200, masterData, 'Successfully Updated Status and Sent Email');
            } else {
                response(req, res, activity, 'Level-2', 'Update-Applicant Status', false, 404, {}, 'Applicant Not Found');
            }
        } catch (err) {
            response(req, res, activity, 'Level-3', 'Update-Applicant Status', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Applicant Status', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};



export let deleteApplicant = async (req, res, next) => {

    try {
        const applicant = await Applicant.findOneAndDelete({ _id: req.query._id })

        response(req, res, activity, 'Level-2', 'Delete-Applicant', true, 200, applicant, 'Successfully Remove Applicant');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Applicant', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



/**
 * @author Balan K K
 * @date 28-05-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get filter Staff Details
 */

export let getFilteredApplication = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.studentId) {
            andList.push({ studentId: req.body.studentId })
        }
        if (req.body.universityId) {
            andList.push({ universityId: req.body.universityId })
        }
        if (req.body.feesPaid) {
            andList.push({ feesPaid: req.body.feesPaid })
        }
        if (req.body.anyVisaRejections) {
            andList.push({ anyVisaRejections: req.body.anyVisaRejections })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const applicantList = await Applicant.find(findQuery).sort({ applicationCode: -1 }).limit(limit).skip(page)

        const applicantCount = await Applicant.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterApplicant', true, 200, { applicantList, applicantCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterApplicant', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


// export const trackApplicationStatus = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {

//         try {
//             const applicantDetails: ApplicantDocument = req.body;
//             const application = await Applicant.findOneAndUpdate({_id: req.query._id});
//             if (!application) {
//                 return response(req, res, activity, 'Level-2', 'Update-Status', false, 404, {}, "Application not found");
//             }

//             if (!Array.isArray(application.status)) {
//                 application.status = []; // Initialize as an empty array if it's not already an array
//             }


//             // Update the timestamp for modifiedOn
//             application.modifiedOn = new Date();

//             // Save the updated application status
//             await application.save();

//             const mailOptions = {
//                 from: config.SERVER.EMAIL_USER,
//                 to: application.email,
//                 subject: 'Welcome to EduFynd',
//                 text: `Hello ${application.name},\n\nYour Application Status has been Updated\n\nCurrent Status: ${application.status}.
//                 \nThis Information for Your Refernece.\n\nBest regards\nAfynd Private Limited\nChennai.`
//             };

//             transporter.sendMail(mailOptions, (error, info) => {

//                 if (error) {
//                     console.error('Error sending email:', error);
//                     return res.status(500).json({ message: 'Error sending email' });
//                 } else {
//                     console.log('Email sent:', info.response);
//                     res.status(201).json({ message: 'Application Status has been Updated and Send Email', Details: application });
//                 }
//             });

//             response(req, res, activity, 'Level-1', 'Update-Status-Changed', true, 200, application, "Status updated successfully and Send to Email");
//         } catch (err) {
// console.log(err)
//             response(req, res, activity, 'Level-3', 'Update-Status-Changed', false, 500, {}, "Internal server error", err.message);
//         }
//     } else {
//         return response(req, res, activity, 'Level-3', 'Update-Status-Changed', false, 422, {}, "Field validation error", JSON.stringify(errors.mapped()));
//     }
// };

export const trackApplicationStatus = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {

        try {
            const applicantDetails: ApplicantDocument = req.body;

            // let application = await Applicant.findOneAndUpdate({_id: req.query._id}, {
            //     $set: {
            //         status: applicantDetails.status,
            //         modifiedOn: new Date(),

            //     }
            // })

            const application = await Applicant.findOneAndUpdate({ _id: req.query._id });
            console.log("dd", application)
            if (!application) {
                return response(req, res, activity, 'Level-2', 'Update-Status', false, 404, {}, "Application not found");
            }



            application.status =  application.status
            // Update the timestamp for modifiedOn
            application.modifiedOn = new Date();

            // Save the updated application status
            await application.save();
            console.log("77", application)
            const mailOptions = {
                from: config.SERVER.EMAIL_USER,
                to: application.email,
                subject: 'Welcome to EduFynd',
                text: `Hello ${application.name},\n\nYour Application Status has been Updated\n\nCurrent Status: ${application.status}.
                \nThis Information for Your Refernece.\n\nBest regards\nAfynd Private Limited\nChennai.`
            };

            transporter.sendMail(mailOptions, (error, info) => {

                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ message: 'Error sending email' });
                } else {
                    console.log('Email sent:', info.response);
                    res.status(201).json({ message: 'Application Status has been Updated and Send Email', Details: application });
                }
            });

            response(req, res, activity, 'Level-1', 'Update-Status-Changed', true, 200, application, "Status updated successfully and Send to Email");
        } catch (err) {
            console.log(err)
            response(req, res, activity, 'Level-3', 'Update-Status-Changed', false, 500, {}, "Internal server error", err.message);
        }
    } else {
        return response(req, res, activity, 'Level-3', 'Update-Status-Changed', false, 422, {}, "Field validation error", JSON.stringify(errors.mapped()));
    }
};