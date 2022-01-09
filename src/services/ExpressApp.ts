import express, { Application } from 'express';
import path from 'path';
import { AdminRoute, VendorRoute, ShoppingRoutes, CustomerRoute } from '../routes';


export default async (app: Application) => {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    //  help to access images from sever to client side
    app.use('images', express.static(path.join(__dirname, 'images')));

    app.use('/admin', AdminRoute);
    app.use('/vendor', VendorRoute);
    app.use('/customer', CustomerRoute);
    app.use(ShoppingRoutes);

    // always keep in last 
    app.use('/', (req, res) => {
        return res.json({ meaage: "hello from food order api :::: " })
    });

    return app;
}
