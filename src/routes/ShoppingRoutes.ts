import express, { Request, Response, NextFunction } from 'express';
import {
    GetFoodAvailability,
    GetTopRestaurants,
    GetFoodsIn30Min,
    SearchFood,
    RestaurantById
} from '../controllers/index';

const router = express.Router();

/** --------------- Food Availability -----------------  **/
router.get('/:pincode', GetFoodAvailability);

/** --------------- Top Restaurant -----------------  **/
router.get('/top-restaurants/:pincode', GetTopRestaurants);

/** --------------- Foods Available in 30 mins -----------------  **/
router.get('/foods-in-30-min/:pincode', GetFoodsIn30Min);

/** --------------- Search Food -----------------  **/
router.get('/search/:pincode', SearchFood);

/** --------------- Find Restaurant By id -----------------  **/
router.get('/restaurant/:id', RestaurantById);



export { router as ShoppingRoutes };