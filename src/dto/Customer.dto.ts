import { IsEmail, isEmpty, Length } from 'class-validator';


export class CreateCustomerInputs {

    @IsEmail()
    email: string;

    @Length(10)
    phone: string;

    @Length(7, 12)
    password: string;

    firstName: string;

    lastName: string;

    address: string;
}

export interface CustomerPayload {
    _id: string;
    email: string;
    verified: boolean;
}

export class UserLoginInputs {

    @IsEmail()
    email: string;

    password: string;

}

export class CartItem {
    _id: string;
    unit: number;
}

export class OrderInputs {
    items: [CartItem];
    txnId: string;
    amount: string;
}

export class CreateDeliveryInputs {

    @IsEmail()
    email: string;

    @Length(10)
    phone: string;

    @Length(7, 12)
    password: string;

    @Length(3, 15)
    firstName: string;

    @Length(3, 15)
    lastName: string;

    @Length(8, 20)
    address: string;

    @Length(4, 12)
    pincode: number;
}
