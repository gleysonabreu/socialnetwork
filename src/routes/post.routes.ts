import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";
import PostController from "@controllers/PostController";
import PostLikeController from "@controllers/PostLikeController";
import multer from "multer";
import multerConfig from "@config/multer";
import checkJWT from "../validations/CheckJWT";

const postRoutes = Router();
const postController = new PostController();
const postLikeController = new PostLikeController();

postRoutes.get(
  "/",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  postController.index
);
postRoutes.post(
  "/",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  multer(multerConfig).array("files[]"),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      message: Joi.string().required(),
    }),
  }),
  postController.create
);
postRoutes.get(
  "/:id",
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
  "/:id",
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
  "/:id",
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
  "/like/:postId",
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
  postLikeController.create
);
postRoutes.get(
  "/like/:postId",
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
  "/like/:postId",
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
