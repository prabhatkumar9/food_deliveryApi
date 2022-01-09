import mongoose, { Schema, Document } from "mongoose";

export interface FoodDoc extends Document {
    vendorId: string,
    name: string,
    description: string,
    category: string,
    foodType: string,
    readyTime: number,
    price: number,
    images: [string]
}

const FoodSchema = new Schema({
    vendorId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: false },
    foodType: { type: String, required: true },
    readyTime: { type: Number, required: true },
    price: { type: Number, required: false },
    images: { type: [String], required: false },
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

export const Food = mongoose.model<FoodDoc>('food', FoodSchema);

