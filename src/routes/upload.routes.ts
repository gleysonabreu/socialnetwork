import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";
import multer from "multer";
import UploadController from "@controllers/UploadController";
import multerConfig from "@config/multer";
import checkJWT from "../validations/CheckJWT";

const uploadRoutes = Router();
const uploadController = new UploadController();

uploadRoutes.post(
  "/uploads/user",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  checkJWT,
  multer(multerConfig).single("file"),
  uploadController.updatePicture
);
export default uploadRoutes;
