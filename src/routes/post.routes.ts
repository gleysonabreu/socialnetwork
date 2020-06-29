import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";
import PostController from "@controllers/PostController";
import PostLikeController from "@controllers/PostLikeController";
import checkJWT from "../validations/CheckJWT";

const postRoutes = Router();
const postController = new PostController();
const postLikeController = new PostLikeController();

postRoutes.get(
  "/post",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  postController.index
);
postRoutes.post(
  "/post",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      message: Joi.string().required(),
    }),
  }),
  postController.create
);
postRoutes.get(
  "/post/:id",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  postController.show
);
postRoutes.put(
  "/post/:id",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      message: Joi.string().required(),
    }),
  }),
  postController.update
);
postRoutes.delete(
  "/post/:id",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  postController.delete
);

postRoutes.post(
  "/post/like",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      postId: Joi.number().required(),
    }),
  }),
  postLikeController.create
);
postRoutes.get(
  "/post/like/:postId",
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
  postLikeController.index
);
postRoutes.delete(
  "/post/like/:postId",
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
  postLikeController.delete
);
export default postRoutes;
