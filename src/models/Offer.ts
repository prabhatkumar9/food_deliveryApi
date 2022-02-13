import mongoose, { Schema, Document } from "mongoose";


export interface OfferDoc extends Document {
    offerType: string,
    title: string, // INR 200 off on weekends
    vendors: [any],
    description: string,
    minValue: number, // minimum order value
    offerAmount: number, // 200 INR
    startValidity: Date,
    endValidity: Date,
    promoCode: string, // WEEK200
    promoType: string, // user // all // bank //card
    bank: [any],
    bins: [any],
    pincode: string,
    isActive: boolean,
}

const OfferSchema = new Schema({
    offerType: { type: String, required: true },
    title: { type: String, required: true },
    vendors: [
        { type: Schema.Types.ObjectId, ref: 'vendor' }
    ],
    description: { type: String, required: true },
    minValue: { type: Number, required: true },
    offerAmount: { type: Number, required: true },
    startValidity: Date,
    endValidity: Date,
    promoCode: { type: String, required: true },
    promoType: { type: String, required: true },
    bank: [],
    bins: [],
    pincode: { type: String, required: true },
    isActive: { type: Boolean, required: true },
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

export const Offer = mongoose.model<OfferDoc>('offer', OfferSchema);