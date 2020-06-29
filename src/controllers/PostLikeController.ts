import { Request, Response, NextFunction } from "express";
import knex from "@database/connection";
import AppError from "../AppError";

class PostLikeController {
  create = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { id: idUser } = response.locals.user.data;
    const { postId } = request.body;

    try {
      const post = await knex("posts").where("id", postId).first();

      if (!post) throw new AppError("This post does not exist.");

      const dataLike = {
        user_id: idUser,
        post_id: postId,
      };

      await knex("post_like").insert(dataLike);
      return response.json({ message: "Liked comment." });
    } catch (error) {
      next(error);
    }
  };

  index = async (request: Request, response: Response): Promise<Response> => {
    const { postId } = request.params;

    const listAllLikes = await knex("post_like")
      .innerJoin("users", function userLike() {
        this.on("post_like.user_id", "=", "users.id");
      })
      .select(
        "post_like.user_id",
        "post_like.post_id",
        "post_like.date",
        "users.firstname",
        "users.lastname",
        "users.photo",
        "users.username"
      )
      .where("post_like.post_id", postId);

    return response.json(listAllLikes);
  };

  delete = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { id: idUser } = response.locals.user.data;
    const { postId } = request.params;

    try {
      const postLike = await knex("post_like")
        .where("user_id", idUser)
        .andWhere("post_id", postId)
        .first();

      if (!postLike) throw new AppError("You didn't like that.");

      await knex("post_like")
        .where("user_id", idUser)
        .andWhere("post_id", postId)
        .del();

      return response.json({ message: "Unliked successfully." });
    } catch (error) {
      next(error);
    }
  };
}

export default PostLikeController;
