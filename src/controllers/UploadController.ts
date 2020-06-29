import { Request, Response, NextFunction } from "express";
import knex from "@database/connection";
import AppError from "../AppError";

interface IPost {
  id: number;
  // eslint-disable-next-line camelcase
  user_id: number;
}
class UploadController {
  addPhotoPost = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { id: idUser } = response.locals.user.data;
    const { key, location: url = "" } = request.file;
    const { postId } = request.params;

    try {
      const post: IPost = await knex("posts")
        .where("id", postId)
        .andWhere("user_id", idUser)
        .first();

      if (!post)
        throw new AppError("This post is not yours, so you cannot add files.");

      const dataImage = {
        url: url || key,
        post_id: postId,
      };

      await knex("post_image").insert(dataImage);
      return response.json({ message: "Image added." });
    } catch (error) {
      next(error);
    }
  };

  updatePicture = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const { id: idUser } = response.locals.user.data;
    const { key, location: url } = request.file;

    const updatePic = {
      photo: url || key,
    };

    await knex("users").where("id", idUser).update(updatePic);
    return response.json({ message: "Photo updated." });
  };
}

export default UploadController;
