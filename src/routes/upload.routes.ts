import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";
import multer from "multer";
import UploadController from "@controllers/UploadController";
import multerConfig from "@config/multer";

const uploadRoutes = Router();
const uploadController = new UploadController();

uploadRoutes.post(
  "/uploads/post/:postId",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  multer(multerConfig).single("file"),
  uploadController.addPhotoPost
);

uploadRoutes.post(
  "/uploads/user",
  celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  }),
  multer(multerConfig).single("file"),
  uploadController.updatePicture
);
export default uploadRoutes;
