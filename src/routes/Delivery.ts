import express from 'express';
import {
    DeliverySignUp, DeliveryLogin, GetDeliveryProfile, ChangeDeliveryStatus,
    EditDeliveryProfile, RequestOTP
} from '../controllers';
import { Authenticate, UserVerified } from '../middlewares';

const router = express.Router();


/**-------------- signup / create customer ---------------- **/
router.post('/signup', DeliverySignUp);

/**-------------- login ---------------- **/
router.post('/login', DeliveryLogin);


/** ---------- Protected ----------------------------------- **/
router.use(Authenticate);


/**-------------- Change service status ---------------- **/
router.put('/change-status', ChangeDeliveryStatus);

/**-------------- request for otp verification ---------------- **/
router.put('/otp', RequestOTP);


/**-------------- profile ---------------- **/
router.get('/profile', GetDeliveryProfile);

/**-------------- Edit profile ---------------- **/
router.patch('/profile', EditDeliveryProfile);






export { router as DeliveryRoute }