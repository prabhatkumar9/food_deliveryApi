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
exports.GetFoods = exports.AddFood = exports.UpdateVendorService = exports.UpdateVendorCoverImage = exports.UpdateVendorProfile = exports.GetVendorProfile = exports.loginVendor = void 0;
const models_1 = require("../models");
const authentication_1 = require("../utility/authentication");
const PasswordUtility_1 = require("../utility/PasswordUtility");
const AdminController_1 = require("./AdminController");
const loginVendor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    const existsvendor = yield (0, AdminController_1.FindVendor)('', email);
    if (existsvendor == null) {
        return res.json({ message: 'Vendor not exists ...!', success: false });
    }
    let passwordUtil = new PasswordUtility_1.PasswordUtil();
    let validPass = yield passwordUtil.validatePassword(existsvendor.password, existsvendor.salt, password);
    if (validPass) {
        const jwtToken = yield (0, authentication_1.GenerateToken)({
            _id: existsvendor._id,
            email: existsvendor.email,
            foodtypes: existsvendor.foodtypes,
            name: existsvendor.name
        });
        return res.json({ message: "login successful", success: true, data: jwtToken });
    }
    return res.json({ message: "invalid password", success: false });
});
exports.loginVendor = loginVendor;
const GetVendorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        return res.json({ data: existingVendor, success: true });
    }
    return res.json({ message: "Vendor info not found..!", success: false });
});
exports.GetVendorProfile = GetVendorProfile;
const UpdateVendorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, foodType, pincode, address, phone } = req.body;
    const user = req.user;
    if (user) {
        const existingUser = yield (0, AdminController_1.FindVendor)(user._id);
        if (existingUser != null) {
            existingUser.name = name;
            existingUser.foodType = foodType;
            existingUser.pincode = pincode;
            existingUser.address = address;
            existingUser.phone = phone;
            const saveResult = yield existingUser.save();
            return res.json({ message: "updated", data: saveResult, success: true });
        }
    }
    return res.json({ message: "Vendor info not found..!", success: false });
});
exports.UpdateVendorProfile = UpdateVendorProfile;
const UpdateVendorCoverImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingUser = yield (0, AdminController_1.FindVendor)(user._id);
        if (existingUser != null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            existingUser.coverImage.push(...images);
            const saveResult = yield existingUser.save();
            return res.json({ message: "updated cover images", data: saveResult, success: true });
        }
    }
    return res.json({ message: "Vendor info not found..!", success: false });
});
exports.UpdateVendorCoverImage = UpdateVendorCoverImage;
const UpdateVendorService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingUser = yield (0, AdminController_1.FindVendor)(user._id);
        if (existingUser != null) {
            existingUser.serviceAvailable = !existingUser.serviceAvailable;
            const saveResult = yield existingUser.save();
            return res.json({ message: "updated", data: saveResult, success: true });
        }
    }
    return res.json({ message: "Vendor info not found..!", success: false });
});
exports.UpdateVendorService = UpdateVendorService;
const AddFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { name, description, category, foodType, readyTime, price } = req.body;
        let vendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (vendor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            const createdFood = yield models_1.Food.create({
                vendorId: user._id,
                name,
                description,
                category,
                foodType,
                readyTime,
                price,
                images,
                rating: 0
            });
            vendor.foods.push(createdFood);
            const result = yield vendor.save();
            return res.json({ message: "food saved..", success: true, data: result });
        }
    }
    return res.json({ message: "Something went wrong with add food..!", success: false });
});
exports.AddFood = AddFood;
const GetFoods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield models_1.Food.find({ vendorId: user._id });
        if (foods !== null) {
            return res.json({ message: "foods found..", data: foods, success: true });
        }
    }
    return res.json({ message: "Foods info not found..!", success: false });
});
exports.GetFoods = GetFoods;
//# sourceMappingURL=VendorController.js.map