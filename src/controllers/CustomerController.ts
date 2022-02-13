import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { CartItem, CreateCustomerInputs, OrderInputs, UserLoginInputs } from '../dto/Customer.dto';
import { Customer, CustomerDoc, DeliveryUser, Food, Offer, Order, Transaction, Vendor } from '../models';
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
        lat: 0, lon: 0,
        orders: []
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

            const result = await profile.save();
            if (result) {
                return res.status(200).json({ success: true, data: result });
            }

            return res.status(400).json({ success: false, message: "Unable to update profile !" });
        }

        return res.status(400).json({ success: false, message: "profile not found !" });
    }
}


/** ----------------- order section ----------------- **/

export const ValidateTxn = async (txnId: string) => {
    const currentTransaction = await Transaction.findById(txnId);
    if (currentTransaction) {
        if (currentTransaction.status.toLowerCase() !== "failed") {
            return { status: true, currentTransaction };
        }
    }

    return { status: false, currentTransaction };
}

export const CreateOrder = async (req: Request, res: Response) => {
    // grab current login customer
    const customer = req.user;
    const { items, txnId, amount } = <OrderInputs>req.body;

    if (customer) {

        /** validate txn */
        const { status, currentTransaction } = await ValidateTxn(txnId);

        if (!status) {
            return res.status(400).json({ message: "Payment is not confirmed !, Unalbe to create Order!", success: false });
        }

        // create order id
        const orderId = `${new Date().toISOString()}_${Math.floor(Math.random() * 89999) + 1000}`;

        console.log("order id ::: ", orderId);

        const profile = await Customer.findById(customer._id);

        let cartItems = Array();
        let netAmount = 0.0;
        let vendorId = '';

        //calculate order amount
        const foods = await Food.find().where('_id').in(items.map(item => item._id)).exec();

        foods.map(food => {
            items.map(({ _id, unit }) => {
                if (food._id == _id) {
                    vendorId = food.vendorId;
                    netAmount += (food.price * unit);
                    cartItems.push({ food, unit });
                }
            });
        });

        // create order with item description
        if (cartItems) {
            const currentOrder = await Order.create({
                orderId: orderId,
                vendorId: vendorId,
                items: cartItems,
                totalAmount: netAmount,
                paidAmount: amount,
                orderDate: new Date(),
                orderStatus: 'WAITING',
                remarks: '',
                deliveryId: '',
                readyTime: 45,
            });

            // update user
            if (currentOrder) {

                /** save profile */
                profile.cart = [] as any;
                profile.orders.push(currentOrder);
                const savedResult = await profile.save();

                /** SAVE txn status  */
                currentTransaction.vendorId = vendorId;
                currentTransaction.orderId = orderId;
                currentTransaction.status = "CONFIRMED";
                await currentTransaction.save();

                AssignOrderForDelivery(currentOrder._id, vendorId);

                return res.status(200).json({ data: savedResult, message: "Order placed !", success: true });
            }

            return res.status(200).json({ message: "Order Fail !", success: false });
        }

        return res.status(200).json({ message: "Cart is empty !", success: false });
    }
}

export const GetOrders = async (req: Request, res: Response) => {
    const customer = req.user;
    if (customer) {
        const profile = await Customer.findById(customer._id).populate('orders');

        if (profile) {
            return res.status(200).json({ data: profile.orders, success: true });
        }

        return res.status(200).json({ message: "No orders found..!", success: false });
    }
}

export const GetOrderById = async (req: Request, res: Response) => {
    const orderId = req.params.id;
    if (orderId) {
        const order = await Order.findById(orderId);

        if (order) {
            return res.status(200).json({ data: order, success: true });
        }

        return res.status(200).json({ message: "Order not found..!", success: false });
    }
}

/** ----------------- cart section ----------------- **/
export const AddToCart = async (req: Request, res: Response) => {
    // grab current login customer
    const customer = req.user;

    if (customer) {

        const profile = await Customer.findById(customer._id).populate('cart.food');
        const { _id, unit } = <CartItem>req.body;
        let cartItems = Array();
        let netAmount = 0.0;

        //calculate order amount
        const food = await Food.findById(_id);

        if (food) {
            if (profile != null) {

                // check cart items
                cartItems = profile.cart;

                if (cartItems.length > 0) {
                    // update cart
                    let existingFood = cartItems.filter((item) => item.food._id.toString() === _id);

                    if (existingFood.length > 0) {
                        const index = cartItems.indexOf(existingFood[0]);
                        if (unit > 0) {
                            cartItems[index] = { food, unit };
                        } else {
                            cartItems.splice(index, 1);
                        }
                    }
                } else {
                    cartItems.push({ food, unit });
                }
            }
        }

        return res.status(200).json({ message: "Unable to create cart!", success: false });
    }
}

export const GetCart = async (req: Request, res: Response) => {
    const customer = req.user;
    if (customer) {

        const profile = await Customer.findById(customer._id).populate('cart.food');
        if (profile) {
            return res.status(200).json({ success: true, data: profile.cart });
        }

        return res.status(400).json({ message: "Cart is empty !", success: false });
    }
}

export const DeleteCart = async (req: Request, res: Response) => {
    const customer = req.user;
    if (customer) {

        const profile = await Customer.findById(customer._id).populate('cart.food');
        if (profile != null) {
            profile.cart = [] as any;

            const cartResult = profile.save();
            return res.status(200).json({ success: true, data: cartResult });
        }

        return res.status(400).json({ message: "Cart is already empty !", success: false });
    }
}


/**
 * VerifyOffer
 */
export const VerifyOffer = async (req: Request, res: Response) => {
    const offerId = req.params.id;
    const user = req.user;

    if (user) {
        const appliedOffer = await Offer.findById(offerId);

        if (appliedOffer) {
            if (appliedOffer.isActive) {
                return res.status(200).json({
                    message: "Offer is valid",
                    data: appliedOffer, success: true
                });
            }
        }

        return res.status(200).json({ message: "Offer is not valid", success: false });

    }
}

/**
 * CreatePayment
 */
export const CreatePayment = async (req: Request, res: Response) => {
    const customer = req.user;
    const { amount, paymentMode, offerId } = req.body;

    let payableAmount = Number(amount);
    /** dedcut offer amount from total */
    if (offerId) {
        const appliedOffer = await Offer.findById(offerId);
        if (appliedOffer) {
            if (appliedOffer.isActive) {
                payableAmount = (payableAmount - appliedOffer.offerAmount);
            }
        }
    }

    /** Perform Payment gateway Charge API call */


    /** right after payment gateway success / failure response */


    /** Create record on transaction */
    const transaction = await Transaction.create({
        customerId: customer._id,
        vendorId: '',
        orderId: '',
        orderValue: payableAmount,
        offerUsed: offerId || "NA",
        status: "OPEN",
        paymentMode: paymentMode,
        paymentResponse: "Payment is cash on delivery"
    });

    return res.status(200).json({ success: true, data: transaction });

}


/** ------ Delivery Notification Section ------ */

const AssignOrderForDelivery = async (order_id: string, vendorId: string) => {
    const vendor = await Vendor.findById(vendorId);

    if (vendor) {
        const areaCode = vendor.pincode;
        const vendorLat = vendor.lat;
        const vendorLon = vendor.lon;

        /** find nearest available delivery person */
        const deliveryPerons = await DeliveryUser.find({ pincode: areaCode, verified: true, isAvailable: true })

        if (deliveryPerons) {
            /**  */

            const currentOrder = await Order.findById(order_id);

            if (currentOrder) {

                // update deliveryid
                // assing delivery person id to currentorder deliveryid 
                currentOrder.deliveryId = deliveryPerons[0]._id;
                await currentOrder.save();
            }
        }

    }
}