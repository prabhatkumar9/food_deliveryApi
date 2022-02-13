import express from 'express';
import {
    CustomerSignUp, CustomerLogin, CustomerVerify,
    RequestOTP, GetCustomerProfile, EditCustomerProfile,
    CreateOrder, GetOrders, GetOrderById,
    AddToCart, GetCart, DeleteCart,
    VerifyOffer, CreatePayment
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


/** cart */
router.post('/cart', AddToCart);
router.get('/cart', GetCart);
router.delete('/cart', DeleteCart);

/** order  */
router.post('/create-order', CreateOrder);
router.get('/orders', GetOrders);
router.get('/order/:id', GetOrderById);

/** Apply Offer */
router.get('/offer/verify/:id', VerifyOffer);

/** payment */
router.post('/create-payment', CreatePayment)


export { router as CustomerRoute }