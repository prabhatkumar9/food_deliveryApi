import mongoose, { Schema, Document } from "mongoose";

export interface OrderDoc extends Document {
    orderId: string,
    vendorId: string,
    items: [any], //[{food,unit:1}]
    totalAmount: number,
    orderDate: Date,
    /** save in txn model */
    // appliedOffer: boolean,
    // offerId: string,
    // paidThrough: string, //COD , Credit/Debit Card, Wallet
    // paymentResponse: string, // {status:true,response:some bank response}
    orderStatus: string, // WAITING // ACCEPT // REJECT / FAILED / UNDER-PROCESS / RAEDY
    remarks: string,
    deliveryId: string,
    paidAmount: number,
    readyTime: number
}

const OrderSchema = new Schema({
    orderId: { type: String, required: true },
    vendorId: { type: String, required: true },
    items: [
        {
            food: { type: Schema.Types.ObjectId, ref: 'food', required: true },
            unit: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    orderDate: { type: Date, required: true },
    orderStatus: { type: String },
    remarks: { type: String },
    deliveryId: { type: String },
    readyTime: { type: Number },
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true,
});

export const Order = mongoose.model<OrderDoc>('order', OrderSchema);

