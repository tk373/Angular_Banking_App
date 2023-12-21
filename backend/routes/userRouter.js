import express from 'express';
import {userController} from '../controllers/userController';

const router = express.Router();
router.post('/register',  userController.register);
router.post('/login', userController.login);

const routerProtected = express.Router();
routerProtected.post('/validate', userController.validate);

export const userRouter = router;
export const userRouterProtected = routerProtected;
