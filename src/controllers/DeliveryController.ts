import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { CreateDeliveryInputs, UserLoginInputs } from '../dto/Customer.dto';
import { DeliveryUser, DeliveryUserDoc } from '../models';
import { GenerateOTP, GenerateToken, OnRequestOTP } from '../utility';
import { PasswordUtil } from '../utility/PasswordUtility';


export const DeliverySignUp = async (req: Request, res: Response) => {
    const deliveryIputs = plainToClass(CreateDeliveryInputs, req.body);

    const inputErrors = await validate(deliveryIputs, { validationError: { target: true } });

    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { email, phone, password,
        firstName, lastName, address, pincode } = deliveryIputs;

    const userExists = await DeliveryUser.findOne({ email: email });

    if (userExists != null) {
        return res.status(400).json({ message: "Delivery User already exists !.", success: false });
    };

    const Util = new PasswordUtil();
    const salt = await Util.createSalt();
    const passwordHash = await Util.createHash(salt, password);

    // const { otp, expiry } = GenerateOTP();

    const result: DeliveryUserDoc = await DeliveryUser.create({
        email, phone, salt,
        password: passwordHash,
        pincode,
        firstName, lastName,
        address,
        verified: false,
        lat: 0, lon: 0,
    });

    if (result) {
        /** * send otp to customer */
        // OnRequestOTP(otp, phone);

        /** * generate the token */
        const signature = await GenerateToken({
            _id: result._id,
            email: result.email,
            verified: result.verified,
        });

        /**  * send the result to client */
        return res.status(200).json({ token: signature, verified: result.verified, email: result.email, success: true });
    }

    return res.status(400).json({ message: "Unable to create user !.", success: false });

}

export const DeliveryLogin = async (req: Request, res: Response) => {

    const userLoginInputs = plainToClass(UserLoginInputs, req.body);

    const loginErrors = await validate(userLoginInputs, { validationError: { target: false } });

    if (loginErrors.length > 0) {
        return res.status(400).json({ message: loginErrors, success: false });
    }

    const { email, password } = userLoginInputs;

    const userExists = await DeliveryUser.findOne({ email: email });

    if (userExists) {

        const passWordutil = new PasswordUtil();
        const valid = await passWordutil.validatePassword(userExists.password, userExists.salt, password);

        if (valid) {
            /** * generate the token */
            const signature = await GenerateToken({
                _id: userExists._id,
                email: userExists.email,
                verified: userExists.verified,
            });

            return res.status(200).json({ data: signature, success: true });
        }

        return res.status(400).json({ message: "Invalid Login Credentials !", success: false });

    }

    return res.status(404).json({ message: "Invalid Delivery User !", success: false });
}

export const GetDeliveryProfile = async (req: Request, res: Response) => {
    const customer = req.user;

    if (customer) {
        const profile = await DeliveryUser.findById(customer._id);

        if (profile) {
            return res.status(200).json({ success: true, data: profile });
        }

        return res.status(200).json({ success: true, message: "profile not found !" });
    }
}

export const EditDeliveryProfile = async (req: Request, res: Response) => {
    const customer = req.user;
    const { phone, firstName, lastName, address, pincode } = req.body;
    if (customer) {
        const profile = await DeliveryUser.findById(customer._id);

        if (profile) {
            profile.phone = phone;
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            profile.pincode = pincode;

            const result = await profile.save();
            if (result) {
                return res.status(200).json({ success: true, data: result });
            }

            return res.status(400).json({ success: false, message: "Unable to update profile !" });
        }

        return res.status(400).json({ success: false, message: "profile not found !" });
    }
}

export const RequestOTP = async (req: Request, res: Response) => {

    const customer = req.user;

    if (customer) {

        const profile = await DeliveryUser.findById(customer._id);

        if (profile) {
            const { otp, expiry } = GenerateOTP();

            // profile.otp = otp;
            // profile.otp_expiry = expiry;

            await profile.save();

            /** * send otp to customer */
            await OnRequestOTP(otp, profile.phone);

            /** * generate the token */
            const signature = await GenerateToken({
                _id: profile._id,
                email: profile.email,
                verified: profile.verified,
            });

            /**  * send the result to client */
            return res.status(200).json({ token: signature, verified: profile.verified, email: profile.email, success: true });

        }

    }

    return res.status(400).json({ message: "User not found !", success: false });

}

export const ChangeDeliveryStatus = async (req: Request, res: Response) => {
    const customer = req.user;
    const { lat, lon } = req.body;
    if (customer) {
        const profile = await DeliveryUser.findById(customer._id);

        if (profile) {

            if (lat && lon) {
                profile.lat = lat;
                profile.lon = lon;
            }

            profile.isAvailable = !profile.isAvailable;

            const result = await profile.save();
            if (result) {
                return res.status(200).json({ success: true, data: result });
            }

            return res.status(400).json({ success: false, message: "Unable to update status !" });
        }

        return res.status(400).json({ success: false, message: "Delivery Person not found !" });
    }
}