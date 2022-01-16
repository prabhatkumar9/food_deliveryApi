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

export class OrderInputs {
    _id: string;
    unit: number
}