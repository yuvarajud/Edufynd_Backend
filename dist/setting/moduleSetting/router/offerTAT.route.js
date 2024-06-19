"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const offerTAT_controller_1 = require("../../moduleSetting/controller/offerTAT.controller");
const Validators_1 = require("../../../middleware/Validators");
const checkAuth_1 = require("../../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.get('/', checkAuth_1.basicAuthUser, offerTAT_controller_1.getAllOfferTAT);
router.get('/getSingleOfferTAT', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), offerTAT_controller_1.getSingleOfferTAT);
router.post('/', checkAuth_1.basicAuthUser, offerTAT_controller_1.createOfferTAT);
router.put('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), offerTAT_controller_1.updateOfferTAT);
router.delete('/', checkAuth_1.basicAuthUser, (0, Validators_1.checkQuery)('_id'), offerTAT_controller_1.deleteOfferTAT);
router.put('/getFilterOfferTAT', checkAuth_1.basicAuthUser, offerTAT_controller_1.getFilteredOfferTAT);
exports.default = router;
//# sourceMappingURL=offerTAT.route.js.map