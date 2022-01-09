import express, { Request, Response } from 'express';
import {
    loginVendor, GetVendorProfile, UpdateVendorProfile,
    UpdateVendorService, AddFood, GetFoods, UpdateVendorCoverImage
} from '../controllers/VendorController';
import { Authenticate } from '../middlewares/index';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// *************** image file saver ***************
// After new Date().toISOString() add replace() to change ":" to an accepted character.
// Windows OS doesn't accept files with a ":"
// new Date().toISOString().replace(/:/g, '-')

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../images'));
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '_' + file.originalname);
    }
});

//  images will be array with max limit 10
const images = multer({ storage: imageStorage }).array('images', 10);
// *************** image file saver ***************


router.post('/login', loginVendor);



// ******** protected routes ***********

router.use(Authenticate);
router.get('/profile', GetVendorProfile);
router.patch('/profile', UpdateVendorProfile);
router.patch('/service', UpdateVendorService);
router.get('/foods', GetFoods);

router.post('/food', images, AddFood);
router.post('/coverImage', images, UpdateVendorCoverImage);


// ******** protected routes ***********


router.get('/', (req: Request, res: Response) => {
    return res.json({ message: "Hellow from vendor >>>>>>>> !" })
});


export { router as VendorRoute }