import { Router } from 'express';

import PostController from './controllers/PostController';
import CommentController from './controllers/CommentController';
import CommentLikeController from './controllers/CommentLikeController';

const routes = Router();
const postController = new PostController();
const commentController = new CommentController();
const commentLikeController = new CommentLikeController();

// Posts Routes
routes.get('/post', postController.index);
routes.post('/post', postController.create);
routes.get('/post/:id', postController.show);
routes.put('/post/:id', postController.update);
routes.delete('/post/:id', postController.delete);

// Comment Routes
routes.get('/comment/:post_id', commentController.index);
routes.post('/comment', commentController.create);
routes.get('/comment/:post_id/:comment_id', commentController.show);
routes.put('/comment/:comment_id', commentController.update);
routes.delete('/comment/:comment_id', commentController.delete);

// Comment Like Route
routes.post('/comment/like', commentLikeController.create);


export default routes;