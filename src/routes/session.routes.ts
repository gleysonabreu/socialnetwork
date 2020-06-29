import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";
import SessionController from "@controllers/SessionController";

const sessionRoutes = Router();
const sessionController = new SessionController();

sessionRoutes.post(
  "/session",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      login: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  sessionController.create
);
export default sessionRoutes;
