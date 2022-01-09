"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVendorById = exports.GetVendor = exports.FindVendor = exports.CreateVendor = void 0;
const models_1 = require("../models");
const PasswordUtility_1 = require("../utility/PasswordUtility");
const CreateVendor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, name, address, pincode, foodType, email, password, ownerName } = req.body;
    const existsvendor = yield models_1.Vendor.findOne({ email: email });
    if (existsvendor != null) {
        return res.json({ message: 'Vendor already exists ...!', success: false });
    }
    let passwordUtil = new PasswordUtility_1.PasswordUtil();
    let salt = yield passwordUtil.createSalt();
    let hash = yield passwordUtil.createHash(salt, password);
    const createVendor = yield models_1.Vendor.create({
        phone, name, address, pincode,
        foodType, email, ownerName,
        salt, password: hash,
        rating: 0, serviceAvailable: false, coverImage: [], foods: []
    });
    return res.json(createVendor);
});
exports.CreateVendor = CreateVendor;
const FindVendor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return models_1.Vendor.findOne({ email: email });
    }
    else {
        return models_1.Vendor.findOne({ _id: id });
    }
});
exports.FindVendor = FindVendor;
const GetVendor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield models_1.Vendor.find();
    if (vendors != null) {
        return res.json({ vendors, success: true });
    }
    return res.json({ message: "no data available..!", success: false });
});
exports.GetVendor = GetVendor;
const GetVendorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorId = req.params.id;
    const vendor = yield (0, exports.FindVendor)(vendorId);
    if (vendor != null) {
        return res.json({ vendor, success: true });
    }
    return res.json({ message: "no data available..!", success: false });
});
exports.GetVendorById = GetVendorById;
//# sourceMappingURL=AdminController.js.map