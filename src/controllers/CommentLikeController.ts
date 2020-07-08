import { Request, Response, NextFunction } from "express";
import knex from "@database/connection";
import AppError from "../AppError";

class CommentLikeController {
  create = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { id } = response.locals.user.data;
    const { commentId } = request.params;

    try {
      const comment = await knex("comment").where("id", commentId).first();
      const commentLike = await knex("comment_like")
        .where("comment_id", commentId)
        .andWhere("user_id", id)
        .first();

      if (!comment)
        throw new AppError("This comment doesn't exist, so you can't like it.");

      if (commentLike) throw new AppError("You already liked that.");
      const dataLike = {
        user_id: id,
        comment_id: commentId,
      };

      await knex("comment_like").insert(dataLike);
      return response.json({ message: "Liked comment." });
    } catch (error) {
      next(error);
    }
  };

  index = async (request: Request, response: Response): Promise<Response> => {
    const { commentId } = request.params;

    const allLikes = await knex("comment_like")
      .innerJoin("users", function commetLUsers() {
        this.on("comment_like.user_id", "=", "users.id");
      })
      .select(
        "comment_like.user_id",
        "comment_like.comment_id",
        "comment_like.date",
        "users.firstname",
        "users.lastname",
        "users.photo",
        "users.username"
      )
      .where("comment_like.comment_id", commentId);

    return response.json(allLikes);
  };

  delete = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { id } = response.locals.user.data;
    const { commentId } = request.params;

    try {
      const commentLike = await knex("comment_like")
        .where("user_id", id)
        .andWhere("comment_id", commentId)
        .first();

      if (!commentLike) throw new AppError("You didn't like that.");

      await knex("comment_like")
        .where("user_id", id)
        .andWhere("comment_id", commentId)
        .del();

      return response.json({ messgae: "Unliked successfully." });
    } catch (error) {
      next(error);
    }
  };
}

export default CommentLikeController;
