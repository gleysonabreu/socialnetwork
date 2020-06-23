import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import knex from "@database/connection";

require("dotenv/config");

interface IToken {
  data: {
    id: number;
  };
}

interface IPost {
  id: number;
  // eslint-disable-next-line camelcase
  user_id: number;
}
class UploadController {
  addPhotoPost = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const { authorization } = request.headers;
    const tokenAuth = authorization.split(" ")[1];
    const { key, location: url = "" } = request.file;
    const { postId } = request.params;

    try {
      const decodedToken = <IToken>(
        jwt.verify(tokenAuth, process.env.SECRET_KEY)
      );

      const post: IPost = await knex("posts")
        .where("id", postId)
        .andWhere("user_id", decodedToken.data.id)
        .first();

      if (!post) {
        return response.status(400).json({
          message: "This post is not yours, so you cannot add files.",
        });
      }

      const dataImage = {
        url: url || key,
        post_id: postId,
      };

      await knex("post_image").insert(dataImage);
      return response.json({ success: true });
    } catch (error) {
      return response.json({ message: "Invalid token." });
    }
  };

  updatePicture = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const { authorization } = request.headers;
    const tokenAuth = authorization.split(" ")[1];
    const { key, location: url } = request.file;

    try {
      const decodedToken = <IToken>(
        jwt.verify(tokenAuth, process.env.SECRET_KEY)
      );
      const updatePic = {
        photo: url || key,
      };

      await knex("users").where("id", decodedToken.data.id).update(updatePic);
      return response.json({ success: true });
    } catch (error) {
      return response.status(400).json({ message: "Invalid token." });
    }
  };
}

export default UploadController;
