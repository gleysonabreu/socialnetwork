import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

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
routes.get('/post', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required()
  }).unknown()
}), postController.index);
routes.post('/post', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required()
  }).unknown()
}), celebrate({
  [Segments.BODY]: Joi.object().keys({
    message: Joi.string().required()
  })
}), postController.create);
routes.get('/post/:id', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required()
  }).unknown()
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required()
  })
}), postController.show);
routes.put('/post/:id', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required()
  }).unknown()
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required()
  })
}), celebrate({
  [Segments.BODY]: Joi.object().keys({
    message: Joi.string().required()
  })
}), postController.update);
routes.delete('/post/:id', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required()
  }).unknown()
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required()
  })
}), postController.delete);

// Comment Routes
routes.get('/comment/:post_id', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required()
  }).unknown()
}), commentController.index);
routes.post('/comment', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required()
  }).unknown()
}), celebrate({
  [Segments.BODY]: Joi.object().keys({
    message: Joi.string().required(),
    post_id: Joi.number().required()
  })
}), commentController.create);
routes.get('/comment/:post_id/:comment_id', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required()
  }).unknown()
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    post_id: Joi.number().required(),
    comment_id: Joi.number().required()
  })
}), commentController.show);
routes.put('/comment/:comment_id', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required()
  }).unknown()
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    comment_id: Joi.number().required()
  })
}), celebrate({
  [Segments.BODY]: Joi.object().keys({
    message: Joi.string().required()
  })
}), commentController.update);
routes.delete('/comment/:comment_id', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required()
  }).unknown()
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    comment_id: Joi.number().required()
  })
}), commentController.delete);

// Comment Like Route
routes.post('/comment/like', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required()
  }).unknown()
}), celebrate({
  [Segments.BODY]: Joi.object().keys({
    comment_id: Joi.number().required()
  })
}), commentLikeController.create);
routes.get('/comment/like/listall/:comment_id', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required()
  }).unknown()
}), commentLikeController.index);
routes.delete('/comment/like/delete/:comment_id', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required()
  }).unknown()
}), celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    comment_id: Joi.number().required()
  })
}), commentLikeController.delete);

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