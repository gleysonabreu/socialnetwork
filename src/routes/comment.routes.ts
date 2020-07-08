import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";
import CommentController from "@controllers/CommentController";
import CommentLikeController from "@controllers/CommentLikeController";
import checkJWT from "../validations/CheckJWT";

const commentRoutes = Router();
const commentController = new CommentController();
const commentLikeController = new CommentLikeController();

commentRoutes.get(
  "/:postId",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      postId: Joi.number().required(),
    }),
  }),
  commentController.index
);
commentRoutes.post(
  "/:postId",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      postId: Joi.number().required(),
    }),
  }),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      message: Joi.string().required(),
    }),
  }),
  commentController.create
);
commentRoutes.get(
  "/single/:commentId",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      commentId: Joi.number().required(),
    }),
  }),
  commentController.show
);
commentRoutes.put(
  "/:commentId",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
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
  "/:commentId",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      commentId: Joi.number().required(),
    }),
  }),
  commentController.delete
);

commentRoutes.post(
  "/like/:commentId",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      commentId: Joi.number().required(),
    }),
  }),
  commentLikeController.create
);
commentRoutes.get(
  "/like/:commentId",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      commentId: Joi.number().required(),
    }),
  }),
  commentLikeController.index
);
commentRoutes.delete(
  "/like/:commentId",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      commentId: Joi.number().required(),
    }),
  }),
  commentLikeController.delete
);
export default commentRoutes;
