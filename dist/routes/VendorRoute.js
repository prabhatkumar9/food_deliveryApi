"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
const express_1 = __importDefault(require("express"));
const VendorController_1 = require("../controllers/VendorController");
const index_1 = require("../middlewares/index");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
exports.VendorRoute = router;
// *************** image file saver ***************
// After new Date().toISOString() add replace() to change ":" to an accepted character.
// Windows OS doesn't accept files with a ":"
// new Date().toISOString().replace(/:/g, '-')
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, '../images'));
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '_' + file.originalname);
    }
});
//  images will be array with max limit 10
const images = (0, multer_1.default)({ storage: imageStorage }).array('images', 10);
// *************** image file saver ***************
router.post('/login', VendorController_1.loginVendor);
// ******** protected routes ***********
router.use(index_1.Authenticate);
router.get('/profile', VendorController_1.GetVendorProfile);
router.patch('/profile', VendorController_1.UpdateVendorProfile);
router.patch('/service', VendorController_1.UpdateVendorService);
router.get('/foods', VendorController_1.GetFoods);
router.post('/food', images, VendorController_1.AddFood);
router.post('/coverImage', images, VendorController_1.UpdateVendorCoverImage);
// ******** protected routes ***********
router.get('/', (req, res) => {
    return res.json({ message: "Hellow from vendor >>>>>>>> !" });
});
//# sourceMappingURL=VendorRoute.js.map