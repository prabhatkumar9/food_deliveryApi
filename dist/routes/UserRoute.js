"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.CustomerRoute = router;
/**-------------- signup / create customer ---------------- **/
router.post('/signup', controllers_1.CustomerSignUp);
/**-------------- login ---------------- **/
router.post('/login', controllers_1.CustomerLogin);
/** ---------- Protected ----------------------------------- **/
router.use(middlewares_1.Authenticate);
/**-------------- verify customer account ---------------- **/
router.patch('/verify', controllers_1.CustomerVerify);
/**-------------- get otp ---------------- **/
router.get('/otp', controllers_1.RequestOTP);
/**-------------- allow only verified customer ---------------- **/
router.use(middlewares_1.UserVerified);
/**-------------- profile ---------------- **/
router.get('/profile', controllers_1.GetCustomerProfile);
/**-------------- Edit profile ---------------- **/
router.patch('/profile', controllers_1.EditCustomerProfile);
//# sourceMappingURL=UserRoute.js.map