import mongoose, { Schema, Document } from "mongoose";

interface VendorDoc extends Document {
    name: string,
    ownerName: string,
    foodType: [string],
    pincode: string,
    address: string,
    phone: string,
    email: string,
    password: string,
    serviceAvailable: boolean,
    coverImage: [any],
    rating: number,
    foods: [any],
    salt: string,
    lat: number,
    lon: number
}

const VendorSchema = new Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String] },
    pincode: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    serviceAvailable: { type: Boolean },
    coverImage: { type: [] },
    rating: { type: Number },
    lat: { type: Number },
    lon: { type: Number },
    salt: { type: String, required: true },
    foods: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'food'
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

export const Vendor = mongoose.model<VendorDoc>('vendor', VendorSchema)

