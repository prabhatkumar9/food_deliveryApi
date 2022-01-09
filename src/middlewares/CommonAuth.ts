import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../dto/Auth.dto";
import { ValidateToken } from "../utility/authentication";

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload
        }
    }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const validate = await ValidateToken(req);

    if (validate) {
        next();
    } else {
        return res.json({ message: "User not authorized..!" })
    }
}

export const UserVerified = async (req: Request, res: Response, next: NextFunction) => {
    const user: any = req.user;
    if (user.verified) {
        next();
    } else {
        return res.status(404).json({ message: "User not verified !", success: false });
    }
}