import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";
import FollowerController from "@controllers/FollowerController";
import checkJWT from "../validations/CheckJWT";

const followerRoutes = Router();
const followerController = new FollowerController();

followerRoutes.post(
  "/:userFollowing",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      userFollowing: Joi.number().required(),
    }),
  }),
  followerController.create
);
followerRoutes.get(
  "/:userFollower",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      userFollower: Joi.number().required(),
    }),
  }),
  followerController.index
);
followerRoutes.delete(
  "/:userFollowing",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      userFollowing: Joi.number().required(),
    }),
  }),
  followerController.delete
);
export default followerRoutes;
