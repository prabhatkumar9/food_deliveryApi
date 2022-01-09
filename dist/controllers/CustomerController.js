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
exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOTP = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const Customer_dto_1 = require("../dto/Customer.dto");
const models_1 = require("../models");
const utility_1 = require("../utility");
const PasswordUtility_1 = require("../utility/PasswordUtility");
const CustomerSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerIputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.CreateCustomerInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerIputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, phone, password, firstName, lastName, address } = customerIputs;
    const userExists = yield models_1.Customer.findOne({ email: email });
    console.log("user exists ::: ", userExists);
    if (userExists != null) {
        return res.status(400).json({ message: "User already exists !.", success: false });
    }
    ;
    const Util = new PasswordUtility_1.PasswordUtil();
    const salt = yield Util.createSalt();
    const passwordHash = yield Util.createHash(salt, password);
    const { otp, expiry } = (0, utility_1.GenerateOTP)();
    const result = yield models_1.Customer.create({
        email, phone, salt,
        password: passwordHash,
        otp: otp,
        otp_expiry: expiry,
        firstName, lastName,
        address,
        verified: false,
        lat: 0, lon: 0
    });
    if (result) {
        /** * send otp to customer */
        (0, utility_1.OnRequestOTP)(otp, phone);
        /** * generate the token */
        const signature = yield (0, utility_1.GenerateToken)({
            _id: result._id,
            email: result.email,
            verified: result.verified,
        });
        /**  * send the result to client */
        return res.status(200).json({ token: signature, verified: result.verified, email: result.email, success: true });
    }
    return res.status(400).json({ message: "Unable to create user !.", success: false });
});
exports.CustomerSignUp = CustomerSignUp;
const CustomerLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userLoginInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.UserLoginInputs, req.body);
    const loginErrors = yield (0, class_validator_1.validate)(userLoginInputs, { validationError: { target: false } });
    if (loginErrors.length > 0) {
        return res.status(400).json({ message: loginErrors, success: false });
    }
    const { email, password } = userLoginInputs;
    const userExists = yield models_1.Customer.findOne({ email: email });
    if (userExists) {
        const passWordutil = new PasswordUtility_1.PasswordUtil();
        const valid = yield passWordutil.validatePassword(userExists.password, userExists.salt, password);
        if (valid) {
            /** * generate the token */
            const signature = yield (0, utility_1.GenerateToken)({
                _id: userExists._id,
                email: userExists.email,
                verified: userExists.verified,
            });
            return res.status(200).json({ data: signature, success: true });
        }
        return res.status(400).json({ message: "Invalid Login Credentials !", success: false });
    }
    return res.status(404).json({ message: "Invalid User !", success: false });
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    console.log("customer :::  ", customer, otp);
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && new Date(profile.otp_expiry) >= new Date()) {
                profile.verified = true;
                const updateProfile = yield profile.save();
                const signature = yield (0, utility_1.GenerateToken)({
                    _id: updateProfile._id,
                    email: updateProfile.email,
                    verified: updateProfile.verified
                });
                return res.status(200).json({
                    token: signature,
                    email: updateProfile.email,
                    verified: updateProfile.verified,
                    success: true
                });
            }
        }
        return res.status(400).json({ message: "Invalid OTP !.", success: false });
    }
    return res.status(400).json({ message: "User not found !.", success: false });
});
exports.CustomerVerify = CustomerVerify;
const RequestOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            const { otp, expiry } = (0, utility_1.GenerateOTP)();
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            /** * send otp to customer */
            yield (0, utility_1.OnRequestOTP)(otp, profile.phone);
            /** * generate the token */
            const signature = yield (0, utility_1.GenerateToken)({
                _id: profile._id,
                email: profile.email,
                verified: profile.verified,
            });
            /**  * send the result to client */
            return res.status(200).json({ token: signature, verified: profile.verified, email: profile.email, success: true });
        }
    }
    return res.status(400).json({ message: "User not found !", success: false });
});
exports.RequestOTP = RequestOTP;
const GetCustomerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            return res.status(200).json({ success: true, data: profile });
        }
        return res.status(200).json({ success: true, message: "profile not found !" });
    }
});
exports.GetCustomerProfile = GetCustomerProfile;
const EditCustomerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const { phone, firstName, lastName, address } = req.body;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            profile.phone = phone;
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = yield (profile === null || profile === void 0 ? void 0 : profile.save());
            if (result) {
                return res.status(200).json({ success: true, data: result });
            }
            return res.status(400).json({ success: false, message: "Unable to update profile !" });
        }
        return res.status(400).json({ success: false, message: "profile not found !" });
    }
});
exports.EditCustomerProfile = EditCustomerProfile;
//# sourceMappingURL=CustomerController.js.map