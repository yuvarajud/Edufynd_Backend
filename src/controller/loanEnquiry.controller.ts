import { LoanEnquiry, LoanEnquiryDocument } from '../model/loanEnquiry.model'
import { validationResult } from "express-validator";

import { response, transporter } from "../helper/commonResponseHandler";
import { clientError, errorMessage } from "../helper/ErrorMessage";


var activity = "LoanEnquiry";



export let getAllLoanEnquiry = async (req, res, next) => {
    try {
        const data = await LoanEnquiry.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-LoanEnquiry', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-LoanEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let getSingleLoanEnquiry = async (req, res, next) => {
    try {
        const student = await LoanEnquiry.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-LoanEnquiry', true, 200, student, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-LoanEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


export let createLoanEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {

            const enquiryDetails: LoanEnquiryDocument = req.body;
            enquiryDetails.createdOn = new Date();
            const createData = new LoanEnquiry(enquiryDetails);
            let insertData = await createData.save();

            response(req, res, activity, 'Level-2', 'LoanEnquiry-Created', true, 200, insertData, clientError.success.registerSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'LoanEnquiry-Created', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'LoanEnquiry-Created', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

export let updateLoanEnquiry = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const loanEnquiryDetails: LoanEnquiryDocument = req.body;
            const updateData = await LoanEnquiry.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    studentName: loanEnquiryDetails.studentName,
                    whatsAppNumber: loanEnquiryDetails.whatsAppNumber,
                    email: loanEnquiryDetails.email,
                    doYouHaveAValidOfferFromAnyUniversity: loanEnquiryDetails.doYouHaveAValidOfferFromAnyUniversity,
                    uploadOfferletter: loanEnquiryDetails.uploadOfferletter,
                    loanAmountRequired: loanEnquiryDetails.loanAmountRequired,
                    desiredCountry: loanEnquiryDetails.desiredCountry,
                    whatIsYourMonthlyIncome: loanEnquiryDetails.whatIsYourMonthlyIncome,
                    passportNumber: loanEnquiryDetails.passportNumber,
                    uploadPassport: loanEnquiryDetails.uploadPassport,
                    didYouApplyForLoanElsewhere: loanEnquiryDetails.didYouApplyForLoanElsewhere,
                    chooseTheBankYouPreviouslyApplied: loanEnquiryDetails.chooseTheBankYouPreviouslyApplied,
                    statusOfPreviousApplication: loanEnquiryDetails.statusOfPreviousApplication,
                    coApplicantName: loanEnquiryDetails.coApplicantName,
                    age: loanEnquiryDetails.age,
                    employmentStatus: loanEnquiryDetails.employmentStatus,
                    incomeDetails: loanEnquiryDetails.incomeDetails,
                    willyouSubmitYourCollateral: loanEnquiryDetails.willyouSubmitYourCollateral,

                    modifiedOn: loanEnquiryDetails.modifiedOn,
                    modifiedBy: loanEnquiryDetails.modifiedBy,
                }

            });
            response(req, res, activity, 'Level-2', 'Update-LoanEnquiryDetails', true, 200, updateData, clientError.success.updateSuccess);
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-LoanEnquiryDetails', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-LoanEnquiryDetails', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}




export let deleteLoanEnquiry = async (req, res, next) => {

    try {
        let id = req.query._id;
        const loan = await LoanEnquiry.findByIdAndDelete({ _id: id })

        response(req, res, activity, 'Level-2', 'Delete-LoanEnquiryDetails', true, 200, loan, 'Successfully Remove LoanEnquiryDetails');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-LoanEnquiryDetails', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

export let getFilteredLoanEnquiry = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if (req.body.desiredCountry) {
            andList.push({ desiredCountry: req.body.desiredCountry })
        }
        if (req.body.studentName) {
            andList.push({ studentName: req.body.studentName })
        }
        if (req.body.passportNo) {
            andList.push({ passportNo: req.body.passportNo })
        }
        if (req.body.email) {
            andList.push({ email: req.body.email })
        }
        if (req.body.mobileNumber) {
            andList.push({ mobileNumber: req.body.mobileNumber })
        }

        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const loanList = await LoanEnquiry.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page)

        const loanCount = await LoanEnquiry.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterLoanEnquiry', true, 200, { loanList, loanCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterLoanEnquiry', false, 500, {}, errorMessage.internalServer, err.message);
    }
};



