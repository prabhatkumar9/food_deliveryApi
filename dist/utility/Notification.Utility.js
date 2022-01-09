"use strict";
/**
 * email
 */
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
exports.OnRequestOTP = exports.GenerateOTP = void 0;
/**
 * notification
 */
/**
 * OTP
 */
const GenerateOTP = () => {
    const otp = Math.floor(1000000 + Math.random() + 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    return { otp, expiry };
};
exports.GenerateOTP = GenerateOTP;
/** using twilio api service */
const OnRequestOTP = (otp, to) => __awaiter(void 0, void 0, void 0, function* () {
    const accountSid = 'AC695f775af69bacf0c62cfa89cfeeee43';
    const authToken = '5ce62691579d47ac2893722f4590cffe';
    const client = require('twilio')(accountSid, authToken);
    client.messages.create({
        body: `Your OTP is ${otp} for account verification.`,
        from: '+14158860691',
        to: `+91${to}`
    }).then((message) => console.log("twilio sms response ::: ", message))
        .catch((e) => {
        console.log("twilio sms error ::: ", e);
    });
});
exports.OnRequestOTP = OnRequestOTP;
/**
 * payment notification
 */ 
//# sourceMappingURL=Notification.Utility.js.map