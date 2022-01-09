import express from 'express';
import {
    CustomerSignUp, CustomerLogin, CustomerVerify,
    RequestOTP, GetCustomerProfile, EditCustomerProfile
} from '../controllers';
import { Authenticate, UserVerified } from '../middlewares';

const router = express.Router();


/**-------------- signup / create customer ---------------- **/
router.post('/signup', CustomerSignUp);

/**-------------- login ---------------- **/
router.post('/login', CustomerLogin);


/** ---------- Protected ----------------------------------- **/
router.use(Authenticate);

/**-------------- verify customer account ---------------- **/
router.patch('/verify', CustomerVerify);

/**-------------- get otp ---------------- **/
router.get('/otp', RequestOTP);



/**-------------- allow only verified customer ---------------- **/
router.use(UserVerified);

/**-------------- profile ---------------- **/
router.get('/profile', GetCustomerProfile);

/**-------------- Edit profile ---------------- **/
router.patch('/profile', EditCustomerProfile);


/** cart
 * order 
 * payment
 */


export { router as CustomerRoute }