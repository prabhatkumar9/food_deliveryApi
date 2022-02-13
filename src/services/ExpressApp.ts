import express, { Application } from 'express';
import path from 'path';
import { AdminRoute, VendorRoute, ShoppingRoutes, CustomerRoute, DeliveryRoute } from '../routes';


export default async (app: Application) => {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const imagePath = path.join(__dirname, '../images');

    //  help to access images from sever to client side
    app.use('images', express.static(imagePath));

    app.use('/admin', AdminRoute);
    app.use('/vendor', VendorRoute);
    app.use('/customer', CustomerRoute);
    app.use('/delivery', DeliveryRoute);
    app.use(ShoppingRoutes);

    // always keep in last 
    app.use('/', (req, res) => {
        return res.json({ meaage: "hello from food order api :::: " })
    });

    return app;
}
