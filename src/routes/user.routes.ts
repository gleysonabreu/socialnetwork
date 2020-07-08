import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";
import UserController from "@controllers/UserController";
import checkJWT from "../validations/CheckJWT";

const userRoutes = Router();
const userController = new UserController();

// User userRoutes
userRoutes.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      firstname: Joi.string().min(3).required(),
      lastname: Joi.string().min(3).required(),
      username: Joi.string().min(3).required(),
      email: Joi.string().min(3).required(),
      dateBirth: Joi.string().required(),
      password: Joi.string().min(6).required(),
    }),
  }),
  userController.create
);

userRoutes.get(
  "/:userId",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      userId: Joi.number().min(1).required(),
    }),
  }),
  userController.show
);

userRoutes.put(
  "/",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      firstname: Joi.string().min(3).required(),
      lastname: Joi.string().min(3).required(),
    }),
  }),
  userController.update
);
export default userRoutes;
