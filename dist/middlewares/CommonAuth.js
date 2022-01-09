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
exports.UserVerified = exports.Authenticate = void 0;
const authentication_1 = require("../utility/authentication");
const Authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validate = yield (0, authentication_1.ValidateToken)(req);
    if (validate) {
        next();
    }
    else {
        return res.json({ message: "User not authorized..!" });
    }
});
exports.Authenticate = Authenticate;
const UserVerified = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user.verified) {
        next();
    }
    else {
        return res.status(404).json({ message: "User not verified !", success: false });
    }
});
exports.UserVerified = UserVerified;
//# sourceMappingURL=CommonAuth.js.map