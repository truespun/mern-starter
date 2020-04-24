import { Router } from 'express';
import * as CommentController from '../controllers/comment.controller';
const router = new Router();


// Get all Comments per post
router.route('/posts/:cuid/comments').get(CommentController.getCommentsPerPost);

// Add a new Comment to the Post
router.route('/posts/:cuid/comments').post(CommentController.addComment);

// Update Comment
router.route('/posts/:cuid/comments/:id').put(CommentController.updateComment);

// Delete Comment
router.route('/posts/:cuid/comments/:id').delete(CommentController.deleteComment);

export default router;
