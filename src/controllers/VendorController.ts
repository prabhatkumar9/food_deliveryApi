import { Request, Response } from 'express';
import { EditVendorInput, VendorLoginInput } from '../dto/CreateVendorInput';
import { CreateFoodInputs } from '../dto/food.dto';
import { Food, Order } from '../models';
import { GenerateToken } from '../utility/authentication';
import { PasswordUtil } from '../utility/PasswordUtility';
import { FindVendor } from './AdminController';

export const loginVendor = async (req: Request, res: Response) => {
    let { email, password } = <VendorLoginInput>req.body;

    const existsvendor: any = await FindVendor('', email);

    if (existsvendor == null) {
        return res.json({ message: 'Vendor not exists ...!', success: false });
    }

    let passwordUtil = new PasswordUtil();
    let validPass = await passwordUtil.validatePassword(existsvendor.password, existsvendor.salt, password);

    if (validPass) {
        const jwtToken = await GenerateToken({
            _id: existsvendor._id,
            email: existsvendor.email,
            foodtypes: existsvendor.foodtypes,
            name: existsvendor.name
        });

        return res.json({ message: "login successful", success: true, data: jwtToken });
    }

    return res.json({ message: "invalid password", success: false });
}

export const GetVendorProfile = async (req: Request, res: Response) => {
    const { user } = req;
    if (user) {
        const existingVendor = await FindVendor(user._id);
        return res.json({ data: existingVendor, success: true });
    }

    return res.json({ message: "Vendor info not found..!", success: false });
}

export const UpdateVendorProfile = async (req: Request, res: Response) => {
    const { name, foodType, pincode, address, phone } = <EditVendorInput>req.body

    const user = req.user;
    if (user) {
        const existingUser: any = await FindVendor(user._id);
        if (existingUser != null) {
            existingUser.name = name;
            existingUser.foodType = foodType;
            existingUser.pincode = pincode;
            existingUser.address = address;
            existingUser.phone = phone;

            const saveResult = await existingUser.save();
            return res.json({ message: "updated", data: saveResult, success: true });
        }
    }

    return res.json({ message: "Vendor info not found..!", success: false });

}

export const UpdateVendorCoverImage = async (req: Request, res: Response) => {

    const user = req.user;
    if (user) {
        const existingUser: any = await FindVendor(user._id);
        if (existingUser != null) {

            const files = req.files as [Express.Multer.File];

            const images = files.map((file: Express.Multer.File) => file.filename);

            existingUser.coverImage.push(...images);

            const saveResult = await existingUser.save();

            return res.json({ message: "updated cover images", data: saveResult, success: true });
        }
    }

    return res.json({ message: "Vendor info not found..!", success: false });

}

export const UpdateVendorService = async (req: Request, res: Response) => {
    const user = req.user;
    if (user) {
        const existingUser: any = await FindVendor(user._id);
        if (existingUser != null) {
            existingUser.serviceAvailable = !existingUser.serviceAvailable;

            const saveResult = await existingUser.save();
            return res.json({ message: "updated", data: saveResult, success: true });
        }
    }

    return res.json({ message: "Vendor info not found..!", success: false });
}

export const AddFood = async (req: Request, res: Response) => {
    const user = req.user;
    if (user) {
        const { name, description, category, foodType, readyTime, price } = <CreateFoodInputs>req.body;

        let vendor = await FindVendor(user._id);

        if (vendor !== null) {
            const files = req.files as [Express.Multer.File];

            const images = files.map((file: Express.Multer.File) => file.filename);

            const createdFood = await Food.create({
                vendorId: user._id,
                name,
                description,
                category,
                foodType,
                readyTime,
                price,
                images,
                rating: 0
            });

            vendor.foods.push(createdFood);
            const result = await vendor.save();

            return res.json({ message: "food saved..", success: true, data: result });
        }


    }
    return res.json({ message: "Something went wrong with add food..!", success: false });
}

export const GetFoods = async (req: Request, res: Response) => {
    const user = req.user;
    if (user) {
        const foods = await Food.find({ vendorId: user._id });

        if (foods !== null) {
            return res.json({ message: "foods found..", data: foods, success: true });
        }
    }
    return res.json({ message: "Foods info not found..!", success: false });
}

/**
 * Orders Processing
 */

export const GetCurrentOrders = async (req: Request, res: Response) => {
    const user = req.user;

    if (user) {
        const orders = await Order.find({ vendorId: user._id }).populate('item.food');

        if (orders != null) {
            return res.status(200).json({ success: true, data: orders });
        }

        return res.status(200).json({ success: false, message: "No orders available !" });
    }
}

export const GetOrderDetails = async (req: Request, res: Response) => {
    const orderId = req.params.id;

    if (orderId) {
        const order = await Order.findById(orderId).populate('item.food');

        if (order != null) {
            return res.status(200).json({ success: true, data: order });
        }

        return res.status(200).json({ success: false, message: "order not found !" });
    }
}

export const ProcessOrder = async (req: Request, res: Response) => {
    // WAITING // ACCEPT // REJECT / FAILED / UNDER-PROCESS / RAEDY

    const orderId = req.params.id;

    const { status, remarks, time } = req.body;

    if (orderId) {
        const order = await Order.findById(orderId).populate('food');

        order.orderStatus = status;
        order.remarks = remarks;

        if (time) {
            order.readyTime = time;
        }

        const orderResult = await order.save();

        if (orderResult) {
            return res.status(200).json({ success: true, data: orderResult });
        }
    }

    return res.status(400).json({ success: false, message: "Unable to process order..!" });


}