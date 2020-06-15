import { Router } from 'express';

import PostController from './controllers/PostController';
import CommentController from './controllers/CommentController';

const routes = Router();
const postController = new PostController();
const commentController = new CommentController();

// Posts Routes
routes.get('/post', postController.index);
routes.post('/post', postController.create);
routes.get('/post/:id', postController.show);
routes.put('/post/:id', postController.update);
routes.delete('/post/:id', postController.delete);

// Comment Routes
routes.get('/comment', commentController.create);


export default routes;