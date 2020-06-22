import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import PostController from '@controllers/PostController';
import CommentController from '@controllers/CommentController';
import CommentLikeController from '@controllers/CommentLikeController';
import PostLikeController from '@controllers/PostLikeController';
import FollowerController from '@controllers/FollowerController';
import SessionController from '@controllers/SessionController';
import UserController from '@controllers/UserController';

const routes = Router();
const postController = new PostController();
const commentController = new CommentController();
const commentLikeController = new CommentLikeController();
const postLikeController = new PostLikeController();
const followerController = new FollowerController();
const sessionController = new SessionController();
const userController = new UserController();

// Posts Routes
routes.get('/post', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), postController.index);
routes.post('/post', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), celebrate({
  [Segments.BODY]: Joi.object().keys({
    message: Joi.string().required(),
  }),
}), postController.create);
routes.get('/post/:id', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),
  }),
}), postController.show);
routes.put('/post/:id', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),
  }),
}), celebrate({
  [Segments.BODY]: Joi.object().keys({
    message: Joi.string().required(),
  }),
}), postController.update);
routes.delete('/post/:id', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),
  }),
}), postController.delete);

// Comment Routes
routes.get('/comment/:postId', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    postId: Joi.number().required(),
  }),
}), commentController.index);
routes.post('/comment', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), celebrate({
  [Segments.BODY]: Joi.object().keys({
    message: Joi.string().required(),
    postId: Joi.number().required(),
  }),
}), commentController.create);
routes.get('/comment/:postId/:commentId', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    postId: Joi.number().required(),
    commentId: Joi.number().required(),
  }),
}), commentController.show);
routes.put('/comment/:commentId', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    commentId: Joi.number().required(),
  }),
}), celebrate({
  [Segments.BODY]: Joi.object().keys({
    message: Joi.string().required(),
  }),
}), commentController.update);
routes.delete('/comment/:commentId', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    commentId: Joi.number().required(),
  }),
}), commentController.delete);

// Comment Like Route
routes.post('/comment/like', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), celebrate({
  [Segments.BODY]: Joi.object().keys({
    commentId: Joi.number().required(),
  }),
}), commentLikeController.create);
routes.get('/comment/like/listall/:commentId', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    commentId: Joi.number().required(),
  }),
}), commentLikeController.index);
routes.delete('/comment/like/delete/:commentId', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    commentId: Joi.number().required(),
  }),
}), commentLikeController.delete);

// Post Like Routes
routes.post('/post/like', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), celebrate({
  [Segments.BODY]: Joi.object().keys({
    postId: Joi.number().required(),
  }),
}), postLikeController.create);
routes.get('/post/like/:postId', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    postId: Joi.number().required(),
  }),
}), postLikeController.index);
routes.delete('/post/like/:postId', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    postId: Joi.number().required(),
  }),
}), postLikeController.delete);

// Followers routes
routes.post('/followers/:userFollowing', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userFollowing: Joi.number().required(),
  }),
}), followerController.create);
routes.get('/followers/:userFollower', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userFollower: Joi.number().required(),
  }),
}), followerController.index);
routes.delete('/followers/:userFollowing', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userFollowing: Joi.number().required(),
  }),
}), followerController.delete);

// Session routes
routes.post('/session', celebrate({
  [Segments.BODY]: Joi.object().keys({
    login: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), sessionController.create);

// User Routes
routes.post('/users', userController.create);

export default routes;
