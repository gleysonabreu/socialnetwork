import { Router } from 'express';

import PostController from './controllers/PostController';
import CommentController from './controllers/CommentController';
import CommentLikeController from './controllers/CommentLikeController';
import PostLikeController from './controllers/PostLikeController';
import FollowerController from './controllers/FollowerController';
import SessionController from './controllers/SessionController';

const routes = Router();
const postController = new PostController();
const commentController = new CommentController();
const commentLikeController = new CommentLikeController();
const postLikeController = new PostLikeController();
const followerController = new FollowerController();
const sessionController = new SessionController();

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
routes.get('/comment/like/listall/:comment_id', commentLikeController.index);
routes.delete('/comment/like/delete/:comment_id', commentLikeController.delete);

// Post Like Routes
routes.post('/post/like', postLikeController.create);
routes.get('/post/like/:post_id', postLikeController.index);
routes.delete('/post/like/:post_id', postLikeController.delete);


// Followers routes
routes.post('/followers/:user_following', followerController.create);
routes.get('/followers/:user_follower', followerController.index);
routes.delete('/followers/:user_following', followerController.delete);

// Session routes
routes.post('/session', sessionController.create);


export default routes;