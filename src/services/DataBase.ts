import mongoose from 'mongoose';
import { MONGO_URI } from '../config';


export default async () => {
    try {
        let res = await mongoose.connect(MONGO_URI, {
            autoIndex: true,
            autoCreate: true
        });

        console.log("db connected :::: ");
    } catch (error) {
        console.log("error in db :::: ", error);
    }
}

