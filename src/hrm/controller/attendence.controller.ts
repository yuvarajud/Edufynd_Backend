import { Attendence, AttendenceDocument } from '../model/attendence.model'
import { Staff, StaffDocument } from '../../model/staff.model'
import { validationResult } from "express-validator";
import { response, } from "../../helper/commonResponseHandler";
import { clientError, errorMessage } from "../../helper/ErrorMessage";
import moment = require('moment');


var activity = "Attendence";




export const getAllAttendence = async (req, res) => {
    try {
        const data = await Attendence.find().sort({ _id: -1 })

        response(req, res, activity, 'Level-1', 'GetAll-Attendence', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetAll-Attendence', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export const getSingleAttendence = async (req, res) => {
    try {
        const data = await Attendence.findOne({ _id: req.query._id })

        response(req, res, activity, 'Level-1', 'GetSingle-Attendence', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-1', 'GetSingle-Attendence', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


export let getFilteredAttendence = async (req, res, next) => {
    console.log("Entering getFilteredAttendence middleware");
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        //  andList.push({ status: "present" })
        if(req.body.employeeId){
            andList.push({employeeId:req.body.employeeId})
        }
        if (req.body.status) {
            andList.push({ status: req.body.status })
        }
        if (req.body.late) {
            andList.push({ late: req.body.late })
        }
        if (req.body.earlyLeaving) {
            andList.push({ earlyLeaving: req.body.earlyLeaving })
        }
        if (req.body.totalWork) {
            andList.push({ totalWork: req.body.totalWork })
        }

       
        findQuery = (andList.length > 0) ? { $and: andList } : {}

        const attendencetList = await Attendence.find(findQuery).sort({ createdAt: -1 }).limit(limit).skip(page).populate("employeeId",{empName:1})
        const attendenceCount = await Attendence.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-Filter Attendence', true, 200, { attendencetList, attendenceCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Filter Attendence', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export let deleteAttendence = async (req, res, next) => {

    try {
        let id = req.query._id;
        const country = await Attendence.findByIdAndDelete({ _id: id })
        response(req, res, activity, 'Level-2', 'Deleted the Attendence', true, 200, country, 'Successfully Remove the Attendence Details');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Deleted the Attendence', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


export const staffClockIn = async (req, res) => {
    try {
        const { staffId } = req.body;
        const attendenceDetails: AttendenceDocument = req.body;
        const today = moment().startOf('day').toDate();
        const shiftStart = moment().set({ hour: 10, minute: 0, second: 0 }).toDate();
        const shiftEnd = moment().set({ hour: 19, minute: 0, second: 0 }).toDate();

        // Check if there's already an attendance record for today
        let attendance = await Attendence.findOne({ staff: staffId, date: today, });
    

        if (attendance) {
            return response(req, res, activity, 'Level-3', 'Update-Check In', false, 422, {}, "Already clocked in today");
        }

        const clockInTime = new Date();
        let lateDuration = 0;

         // Calculate late duration if clocking in after shift start time
         if (clockInTime > shiftStart) {
            lateDuration = moment(clockInTime).diff(moment(shiftStart), 'minutes');
        }
        const formattedLateDuration = `${Math.floor(lateDuration / 60)}h ${lateDuration % 60}min`;

        attendance = new Attendence({...attendenceDetails,clockIn: clockInTime, date: today, status: 'Present', late: formattedLateDuration})

        await attendance.save();
        return response(req, res, activity, 'Level-2', 'Update-Check In', true, 200, attendance, "Clocked in successfully");
    } catch (err) {
        return response(req, res, activity, 'Level-3', 'Update-Check In', false, 500, {}, 'Internal server error.', err.message);
    }
};
  


export const staffClockOut = async (req, res) => {
    try {
        const { staffId } = req.body;
        const today = moment().startOf('day').toDate();
        const shiftEnd = moment().set({ hour: 19, minute: 0, second: 0 }).toDate();

        // Find today's attendance record
        let attendance = await Attendence.findOne({ staff: staffId, date: today });

        if (!attendance) {
            return response(req, res, activity, 'Level-3', 'Update-Check Out', false, 422, {}, "No clock in record found for today");
        }

        const clockOutTime = new Date();
        let earlyLeavingDuration = 0;

          // Calculate early leaving duration if clocking out before shift end time
          if (clockOutTime < shiftEnd) {
            earlyLeavingDuration = moment(shiftEnd).diff(moment(clockOutTime), 'minutes');
        }

        const formattedEarlyLeavingDuration = `${Math.floor(earlyLeavingDuration / 60)}h ${earlyLeavingDuration % 60}min`;
        
        // Update the clockOut time and calculate total work hours
        attendance.clockOut = clockOutTime
        const diff = moment(attendance.clockOut).diff(moment(attendance.clockIn), 'hours', true);
        const hours = `${Math.floor(diff / 60)}h ${(diff % 60).toFixed(2)}min`;
        attendance.totalWork = hours;
        attendance.earlyLeaving = formattedEarlyLeavingDuration;
        await attendance.save();

        return response(req, res, activity, 'Level-2', 'Update-Check Out', true, 200, attendance, "Clocked out successfully");
    } catch (err) {
 
        return response(req, res, activity, 'Level-3', 'Update-Check Out', false, 500, {}, 'Internal server error.', err.message);
    }
};

