"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = require("../controller/student.controller");
const contact_controller_1 = require("../controller/contact.controller");
const Validators_1 = require("../middleware/Validators");
const checkAuth_1 = require("../middleware/checkAuth");
const tokenManager_1 = require("../utils/tokenManager");
const fileUploaded_1 = require("../utils/fileUploaded");
const router = (0, express_1.Router)();
router.get('/', //get all users
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, student_controller_1.getAllStudent);
router.get('/getSingleStudent', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), student_controller_1.getSingleStudent);
router.post('/', (0, Validators_1.checkRequestBodyParams)('email'), student_controller_1.saveStudent);
router.post('/contact', contact_controller_1.createContact);
router.put('/', // update user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkRequestBodyParams)('_id'), fileUploaded_1.default.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'passport', maxCount: 1 },
    { name: 'sslc', maxCount: 1 },
    { name: 'hsc', maxCount: 1 },
    { name: 'degree', maxCount: 10 },
    { name: 'additional', maxCount: 10 }
]), student_controller_1.updateStudent);
router.delete('/', //delete user
checkAuth_1.basicAuthUser, tokenManager_1.checkSession, (0, Validators_1.checkQuery)('_id'), student_controller_1.deleteStudent);
router.put('/getFilterStudent', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, student_controller_1.getFilteredStudent);
router.put('/getFilterStudentBySuperAdmin', checkAuth_1.basicAuthUser, tokenManager_1.checkSession, student_controller_1.getFilteredStudentBySuperAdmin);
router.post('/import', // CSV File to json and Store into Database
fileUploaded_1.default.single('file'), student_controller_1.csvToJson);
router.put('/createStudentBySuperAdmin', //create student by super Admin
// basicAuthUser,
// checkSession,
// checkQuery('_id'),
student_controller_1.createStudentBySuperAdmin);
router.put('/forgot', //create student by super Admin
// basicAuthUser,
// checkSession,
// // checkQuery('_id'),
student_controller_1.forgotPassword);
exports.default = router;
//# sourceMappingURL=student.routes.js.map