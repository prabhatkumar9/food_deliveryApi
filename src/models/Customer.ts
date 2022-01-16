import mongoose, { Schema, Document } from "mongoose";
import { OrderDoc } from ".";

export interface CustomerDoc extends Document {
    email: string,
    password: string,
    salt: string
    firstName: string,
    lastName: string,
    address: string,
    phone: string,
    verified: boolean,
    otp: number,
    otp_expiry: Date,
    lat: number,
    lon: number,
    orders: [OrderDoc],
    cart: [any];
}

const CustomerSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    address: { type: String, required: true },
    phone: { type: Number, required: true },
    verified: { type: Boolean, required: true },
    otp: { type: Number, required: true },
    otp_expiry: { type: Date, required: true },
    lat: { type: Number },
    lon: { type: Number },
    cart: [
        {
            food: { type: Schema.Types.ObjectId, ref: 'food', required: true },
            unit: { type: Number, required: true }
        }
    ],
    orders: [{
        type: Schema.Types.ObjectId, ref: 'order'
    }]
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
});

export const Customer = mongoose.model<CustomerDoc>('customer', CustomerSchema)

