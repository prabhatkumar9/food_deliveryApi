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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateToken = exports.GenerateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const GenerateToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.sign(payload, config_1.TOKEN_SECRET, { expiresIn: '1d' });
});
exports.GenerateToken = GenerateToken;
const ValidateToken = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const signature = req.get('Authorization');
    // console.log("toekn :::: ", signature.split(' ')[1]);
    if (signature) {
        try {
            const payload = yield jsonwebtoken_1.default.verify(signature.split(' ')[1], config_1.TOKEN_SECRET);
            req.user = payload;
            // console.log("payload ::: ", payload);
            return true;
        }
        catch (error) {
            // console.log("token error ::: ", error);
            return false;
        }
    }
    return false;
});
exports.ValidateToken = ValidateToken;
//# sourceMappingURL=authentication.js.map