import express, { Request, Response, NextFunction } from 'express';
import {
    CreateVendor, GetVendor, GetVendorById,
    GettransactionById, GetTransactions,
    VerifyDeliveryPerson, GetDeliveryPersons
} from '../controllers';

const router = express.Router();

router.post('/vendor', CreateVendor);
router.get('/vendor', GetVendor);
router.get('/vendor/:id', GetVendorById);


router.get('/transactions', GetTransactions);
router.get('/transaction/:id', GettransactionById);

router.patch('/verify-delivery-user', VerifyDeliveryPerson);
router.get('/delivery-users', GetDeliveryPersons);


router.get('/', (req: Request, res: Response) => {
    return res.json({ message: "Hellow from admin >>>>>>>> !" })
})

export { router as AdminRoute }