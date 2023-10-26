import { Router } from 'express';
import { AuthController } from '../controllers/auth.js';
import { upload } from '../modules/multer-file-system.js'
const router = Router();

router.post('/register', upload.single("picture"), new AuthController().register);
router.post('/login', new AuthController().login);

export default router;