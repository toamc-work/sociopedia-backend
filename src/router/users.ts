import { Router } from 'express';
import { UserController } from '../controllers/users.js';
import { verifyToken } from '../middleware/auth.js';
const router = Router();

router.get("/:id", verifyToken, new UserController().getUser);
router.get("/:id/friends", verifyToken, new UserController().getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, new UserController().addRemoveFriend);

export default router;