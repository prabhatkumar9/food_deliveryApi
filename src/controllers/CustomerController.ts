import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { CreateCustomerInputs, UserLoginInputs } from '../dto/Customer.dto';
import { Customer, CustomerDoc } from '../models';
import { GenerateOTP, GenerateToken, OnRequestOTP } from '../utility';
import { PasswordUtil } from '../utility/PasswordUtility';


export const CustomerSignUp = async (req: Request, res: Response) => {
    const customerIputs = plainToClass(CreateCustomerInputs, req.body);

    const inputErrors = await validate(customerIputs, { validationError: { target: true } });

    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { email, phone, password, firstName, lastName, address } = customerIputs;

    const userExists = await Customer.findOne({ email: email });

    // console.log("user exists ::: ", userExists);


    if (userExists != null) {
        return res.status(400).json({ message: "User already exists !.", success: false });
    };

    const Util = new PasswordUtil();
    const salt = await Util.createSalt();
    const passwordHash = await Util.createHash(salt, password);

    const { otp, expiry } = GenerateOTP();

    const result: CustomerDoc = await Customer.create({
        email, phone, salt,
        password: passwordHash,
        otp: otp,
        otp_expiry: expiry,
        firstName, lastName,
        address,
        verified: false,
        lat: 0, lon: 0
    });

    if (result) {
        /** * send otp to customer */
        OnRequestOTP(otp, phone);

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

export const CustomerLogin = async (req: Request, res: Response) => {

    const userLoginInputs = plainToClass(UserLoginInputs, req.body);

    const loginErrors = await validate(userLoginInputs, { validationError: { target: false } });

    if (loginErrors.length > 0) {
        return res.status(400).json({ message: loginErrors, success: false });
    }

    const { email, password } = userLoginInputs;

    const userExists = await Customer.findOne({ email: email });

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

    return res.status(404).json({ message: "Invalid User !", success: false });
}

export const CustomerVerify = async (req: Request, res: Response) => {
    const { otp } = req.body;

    const customer = req.user;

    console.log("customer :::  ", customer, otp);


    if (customer) {
        const profile = await Customer.findById(customer._id);

        if (profile) {
            if (profile.otp === parseInt(otp) && new Date(profile.otp_expiry) >= new Date()) {
                profile.verified = true;
                const updateProfile = await profile.save();

                const signature = await GenerateToken({
                    _id: updateProfile._id,
                    email: updateProfile.email,
                    verified: updateProfile.verified
                });

                return res.status(200).json({
                    token: signature,
                    email: updateProfile.email,
                    verified: updateProfile.verified,
                    success: true
                });
            }
        }

        return res.status(400).json({ message: "Invalid OTP !.", success: false });

    }

    return res.status(400).json({ message: "User not found !.", success: false });
}

export const RequestOTP = async (req: Request, res: Response) => {

    const customer = req.user;

    if (customer) {

        const profile = await Customer.findById(customer._id);

        if (profile) {
            const { otp, expiry } = GenerateOTP();

            profile.otp = otp;
            profile.otp_expiry = expiry;

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

export const GetCustomerProfile = async (req: Request, res: Response) => {
    const customer = req.user;

    if (customer) {
        const profile = await Customer.findById(customer._id);

        if (profile) {
            return res.status(200).json({ success: true, data: profile });
        }

        return res.status(200).json({ success: true, message: "profile not found !" });
    }
}

export const EditCustomerProfile = async (req: Request, res: Response) => {
    const customer = req.user;
    const { phone, firstName, lastName, address } = req.body;
    if (customer) {
        const profile = await Customer.findById(customer._id);

        if (profile) {
            profile.phone = phone;
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;

            const result = await profile?.save();
            if (result) {
                return res.status(200).json({ success: true, data: result });
            }

            return res.status(400).json({ success: false, message: "Unable to update profile !" });
        }

        return res.status(400).json({ success: false, message: "profile not found !" });
    }
}