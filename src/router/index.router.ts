debugger
import {Router} from 'express';
import authRouter from './auth.js';
import postRouter from './posts.js';
import userRouter from './users.js';
import { AuthController } from  "../controllers/auth.js";
import { PostController } from  "../controllers/posts.js";
import { UserController } from  "../controllers/users.js";

const router = Router();

router.use(new AuthController()['@path'], authRouter);
router.use(new PostController()['@path'], postRouter);
router.use(new UserController()['@path'], userRouter);

export default router;

