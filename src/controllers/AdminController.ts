import { Request, Response, NextFunction } from 'express';
import { CreateVendorInput } from '../dto';
import { Vendor } from '../models';
import { PasswordUtil } from '../utility/PasswordUtility';

export const CreateVendor = async (req: Request, res: Response) => {
    const { phone, name, address, pincode,
        foodType, email, password, ownerName } = <CreateVendorInput>req.body;

    const existsvendor = await Vendor.findOne({ email: email });

    if (existsvendor != null) {
        return res.json({ message: 'Vendor already exists ...!', success: false });
    }

    let passwordUtil = new PasswordUtil();
    let salt = await passwordUtil.createSalt();
    let hash = await passwordUtil.createHash(salt, password);

    const createVendor = await Vendor.create({
        phone, name, address, pincode,
        foodType, email, ownerName,
        salt, password: hash,
        rating: 0, serviceAvailable: false, coverImage: [], foods: []
    });

    return res.json(createVendor);
}

export const FindVendor = async (id: string | undefined, email?: string) => {
    if (email) {
        return Vendor.findOne({ email: email });
    } else {
        return Vendor.findOne({ _id: id });
    }
}

export const GetVendor = async (req: Request, res: Response) => {

    const vendors = await Vendor.find();
    if (vendors != null) {
        return res.json({ vendors, success: true });
    }

    return res.json({ message: "no data available..!", success: false });
}

export const GetVendorById = async (req: Request, res: Response) => {
    const vendorId = req.params.id;
    const vendor = await FindVendor(vendorId);

    if (vendor != null) {
        return res.json({ vendor, success: true });
    }

    return res.json({ message: "no data available..!", success: false });

}