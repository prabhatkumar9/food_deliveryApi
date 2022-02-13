import { Request, Response } from 'express';
import { CreateVendorInput } from '../dto';
import { DeliveryUser, Transaction, Vendor } from '../models';
import { PasswordUtil } from '../utility/PasswordUtility';

export const CreateVendor = async (req: Request, res: Response) => {
    const { phone, name, address, pincode,
        foodType, email, password, ownerName, lat, lon } = <CreateVendorInput>req.body;

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
        salt, password: hash, lat, lon,
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

/** Get transaction details */

export const GetTransactions = async (req: Request, res: Response) => {
    const transactions = await Transaction.find();

    if (transactions) {
        return res.status(200).json({ success: true, data: transactions });
    }

    return res.status(200).json({ success: false, message: "Unable to get transactions !" });
}

export const GettransactionById = async (req: Request, res: Response) => {
    const id = req.params.id;

    const transaction = await Transaction.findById(id);

    if (transaction) {
        return res.status(200).json({ success: true, data: transaction });
    }

    return res.status(200).json({ success: false, message: "transaction not found !" });

}


/** delivery persons control */
export const VerifyDeliveryPerson = async (req: Request, res: Response) => {
    const { id, status } = req.body;

    if (id) {
        const profile = await DeliveryUser.findById(id);

        if (profile) {
            profile.verified = status;

            const result = profile.save();

            return res.status(200).json({ success: true, data: result });
        }
    }

    return res.status(400).json({ success: false, message: "User not found..." })
}

export const GetDeliveryPersons = async (req: Request, res: Response) => {

    const allUsers = await DeliveryUser.find();

    if (allUsers !== null) {

        return res.status(200).json({ success: true, data: allUsers });
    }

    return res.status(400).json({ success: false, message: "Users not found..." })

}
