"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../controllers/index");
const router = express_1.default.Router();
exports.ShoppingRoutes = router;
/** --------------- Food Availability -----------------  **/
router.get('/:pincode', index_1.GetFoodAvailability);
/** --------------- Top Restaurant -----------------  **/
router.get('/top-restaurants/:pincode', index_1.GetTopRestaurants);
/** --------------- Foods Available in 30 mins -----------------  **/
router.get('/foods-in-30-min/:pincode', index_1.GetFoodsIn30Min);
/** --------------- Search Food -----------------  **/
router.get('/search/:pincode', index_1.SearchFood);
/** --------------- Find Restaurant By id -----------------  **/
router.get('/restaurant/:id', index_1.RestaurantById);
//# sourceMappingURL=ShoppingRoutes.js.map