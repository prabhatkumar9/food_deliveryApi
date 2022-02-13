import express, { Request, Response, NextFunction } from "express";
import { FoodDoc, Offer, Vendor } from "../models";

export const GetFoodAvailability = async (req: Request, res: Response) => {
    const pincode = req.params.pincode;

    const result = await Vendor.find({ pincode: pincode, serviceAvailable: true }).
        sort([['rating', 'descending']])
        .populate('foods');

    if (result.length > 0) {
        return res.status(200).json({ success: true, data: result });
    }

    return res.status(400).json({ success: false, message: "No data found.." });
}

export const GetTopRestaurants = async (req: Request, res: Response) => {
    const pincode = req.params.pincode;

    const result = await Vendor.find({ pincode: pincode, serviceAvailable: true }).
        sort([['rating', 'descending']])
        .limit(10)

    if (result.length > 0) {
        return res.status(200).json({ success: true, data: result });
    }

    return res.status(400).json({ success: false, message: "No data found.." });

}

export const GetFoodsIn30Min = async (req: Request, res: Response) => {
    const pincode = req.params.pincode;

    const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
        .populate("foods");

    if (result.length > 0) {
        let foodResult: any = [];

        result.map(vendor => {
            const foods = vendor.foods as [FoodDoc];
            foodResult.push(...foods.filter(food => food.readyTime <= 30))
        });

        return res.status(200).json({ success: true, data: foodResult });
    }

    return res.status(400).json({ success: false, message: "No data found.." });

}

export const SearchFood = async (req: Request, res: Response) => {
    const pincode = req.params.pincode;

    const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
        .populate("foods");

    if (result.length > 0) {

        let foodResult: any = [];

        result.map(item => foodResult.push(...item.foods));

        return res.status(200).json({ success: true, data: foodResult });
    }

    return res.status(400).json({ success: false, message: "No data found.." });

}

export const RestaurantById = async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await Vendor.findById(id);

    if (result) {
        return res.status(200).json({ success: true, data: result });
    }

    return res.status(400).json({ success: false, message: "No data found.." });

}

/**
 * GetOffersByPincode
 */

export const GetOffersByPincode = async (req: Request, res: Response) => {
    const pincode = req.params.pincode;

    const offers = await Offer.find({ pincode: pincode, isActive: true });

    if (offers) {
        return res.status(200).json({ data: offers, success: true });
    }

    return res.status(400).json({ message: "offers not available !", success: false });

}