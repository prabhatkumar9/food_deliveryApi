"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.AdminRoute = router;
router.post('/vendor', controllers_1.CreateVendor);
router.get('/vendor', controllers_1.GetVendor);
router.get('/vendor/:id', controllers_1.GetVendorById);
router.get('/', (req, res) => {
    return res.json({ message: "Hellow from admin >>>>>>>> !" });
});
//# sourceMappingURL=AdminRoute.js.map