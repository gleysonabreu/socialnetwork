import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";
import CommentController from "@controllers/CommentController";
import CommentLikeController from "@controllers/CommentLikeController";

const commentRoutes = Router();
const commentController = new CommentController();
const commentLikeController = new CommentLikeController();

commentRoutes.get(
  "/comment/:postId",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      postId: Joi.number().required(),
    }),
  }),
  commentController.index
);
commentRoutes.post(
  "/comment",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      message: Joi.string().required(),
      postId: Joi.number().required(),
    }),
  }),
  commentController.create
);
commentRoutes.get(
  "/comment/:postId/:commentId",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      postId: Joi.number().required(),
      commentId: Joi.number().required(),
    }),
  }),
  commentController.show
);
commentRoutes.put(
  "/comment/:commentId",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      commentId: Joi.number().required(),
    }),
  }),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      message: Joi.string().required(),
    }),
  }),
  commentController.update
);
commentRoutes.delete(
  "/comment/:commentId",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      commentId: Joi.number().required(),
    }),
  }),
  commentController.delete
);

commentRoutes.post(
  "/comment/like",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      commentId: Joi.number().required(),
    }),
  }),
  commentLikeController.create
);
commentRoutes.get(
  "/comment/like/listall/:commentId",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      commentId: Joi.number().required(),
    }),
  }),
  commentLikeController.index
);
commentRoutes.delete(
  "/comment/like/delete/:commentId",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      commentId: Joi.number().required(),
    }),
  }),
  commentLikeController.delete
);
export default commentRoutes;
