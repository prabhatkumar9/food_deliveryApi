import mongoose, { Schema, Document } from "mongoose";

export interface TransactionDoc extends Document {
    customerId: string,
    vendorId: string,
    orderId: string,
    orderValue: number,
    offerUsed: string,
    status: string,
    paymentMode: string,
    paymentResponse: string,
}

const TransactionSchema = new Schema({
    customerId: { type: String, required: true },
    vendorId: { type: String, required: true },
    orderId: { type: String, required: true },
    orderValue: { type: Number, required: true },
    offerUsed: { type: String, required: true },
    status: { type: String, required: true },
    paymentMode: { type: String, required: true },
    paymentResponse: { type: String, required: true },
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

export const Transaction = mongoose.model<TransactionDoc>('transaction', TransactionSchema);

