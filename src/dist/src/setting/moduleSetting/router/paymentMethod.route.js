"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentMethod_controller_1 = require("../../moduleSetting/controller/paymentMethod.controller");
const Validators_1 = require("../../../middleware/Validators");
const checkAuth_1 = require("../../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, paymentMethod_controller_1.getAllPaymentMethod);
router.get('/getSinglePaymentMethod', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), paymentMethod_controller_1.getSinglePaymentMethod);
router.post('/', checkAuth_1.basicAuthUser, paymentMethod_controller_1.createPaymentMethod);
router.put('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), paymentMethod_controller_1.updatePaymentMethod);
router.delete('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), paymentMethod_controller_1.deletePaymentMethod);
router.put('/getFilterPaymentMethod', checkAuth_1.basicAuthUser, paymentMethod_controller_1.getFilteredPaymentMethod);
exports.default = router;
//# sourceMappingURL=paymentMethod.route.js.map