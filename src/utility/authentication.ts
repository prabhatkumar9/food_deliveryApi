import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config';
import { AuthPayload } from '../dto';
 

export const GenerateToken = async (payload: AuthPayload) => {
    return jwt.sign(payload, TOKEN_SECRET, { expiresIn: '1d' });
}


export const ValidateToken = async (req: Request) => {

    const signature: any = req.get('Authorization');

    // console.log("toekn :::: ", signature.split(' ')[1]);
    if (signature) {
        try {
            const payload = await jwt.verify(signature.split(' ')[1], TOKEN_SECRET) as AuthPayload;
            req.user = payload;
            // console.log("payload ::: ", payload);
            return true;
        } catch (error) {
            // console.log("token error ::: ", error);
            return false;
        }
    }
    return false;
}