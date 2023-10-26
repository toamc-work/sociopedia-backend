import { Router } from 'express';
import { PostController } from '../controllers/posts.js';
import { upload } from '../modules/multer-file-system.js'
import { verifyToken } from '../middleware/auth.js';
const router = Router();

router.post('/', upload.single("picture"), new PostController().createPost);
router.get('/', verifyToken, new PostController().getFeedPosts);
router.get('/:userId/posts', verifyToken, new PostController().getUserPosts);
router.patch('/:id/like', verifyToken, new PostController().likePost);

export default router;