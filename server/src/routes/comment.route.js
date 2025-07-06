import express from 'express';
import { createComment, deleteComment, getAllComments } from '../controllers/comment.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// public routes
router.get("/post/:postId", getAllComments);

// protected routes
router.post("/post/:postId", protectRoute, createComment);
router.delete("/:commentId", deleteComment);

export default router;