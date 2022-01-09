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
exports.RestaurantById = exports.SearchFood = exports.GetFoodsIn30Min = exports.GetTopRestaurants = exports.GetFoodAvailability = void 0;
const models_1 = require("../models");
const GetFoodAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: true }).
        sort([['rating', 'descending']])
        .populate('foods');
    if (result.length > 0) {
        return res.status(200).json({ success: true, data: result });
    }
    return res.status(400).json({ success: false, message: "No data found.." });
});
exports.GetFoodAvailability = GetFoodAvailability;
const GetTopRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: true }).
        sort([['rating', 'descending']])
        .limit(10);
    if (result.length > 0) {
        return res.status(200).json({ success: true, data: result });
    }
    return res.status(400).json({ success: false, message: "No data found.." });
});
exports.GetTopRestaurants = GetTopRestaurants;
const GetFoodsIn30Min = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: true })
        .populate("foods");
    if (result.length > 0) {
        let foodResult = [];
        result.map(vendor => {
            const foods = vendor.foods;
            foodResult.push(...foods.filter(food => food.readyTime <= 30));
        });
        return res.status(200).json({ success: true, data: foodResult });
    }
    return res.status(400).json({ success: false, message: "No data found.." });
});
exports.GetFoodsIn30Min = GetFoodsIn30Min;
const SearchFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: true })
        .populate("foods");
    if (result.length > 0) {
        let foodResult = [];
        result.map(item => foodResult.push(...item.foods));
        return res.status(200).json({ success: true, data: foodResult });
    }
    return res.status(400).json({ success: false, message: "No data found.." });
});
exports.SearchFood = SearchFood;
const RestaurantById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield models_1.Vendor.findById(id);
    if (result) {
        return res.status(200).json({ success: true, data: result });
    }
    return res.status(400).json({ success: false, message: "No data found.." });
});
exports.RestaurantById = RestaurantById;
//# sourceMappingURL=ShoppingController.js.map