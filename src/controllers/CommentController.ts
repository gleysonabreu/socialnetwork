import { Request, Response, NextFunction } from "express";
import knex from "@database/connection";
import IComment from "@dtos/IComment";
import AppError from "../AppError";

require("dotenv/config");

class CommentController {
  create = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { id } = response.locals.user.data;
    const { postId } = request.params;
    const { message } = request.body;

    try {
      const post = await knex("posts").where("id", postId).first();
      if (!post)
        throw new AppError("Post not found, so you cannot comment it.");

      const dataComment = {
        message,
        user_id: id,
        post_id: postId,
      };

      await knex("comment").insert(dataComment);
      return response.json({ message: "Comment created." });
    } catch (error) {
      next(error);
    }
  };

  index = async (request: Request, response: Response): Promise<Response> => {
    const { postId } = request.params;

    const comments = await knex("comment")
      .innerJoin("users", function commentUsers() {
        this.on("comment.user_id", "users.id");
      })
      .where("post_id", postId)
      .select(
        "comment.id",
        "comment.message",
        "comment.date",
        "users.firstname",
        "users.lastname",
        "users.photo",
        "users.username"
      );

    return response.json(comments);
  };

  show = async (request: Request, response: Response): Promise<Response> => {
    const { commentId } = request.params;
    const comment = await knex("comment")
      .innerJoin("users", function commentUsers() {
        this.on("comment.user_id", "users.id");
      })
      .where("comment.id", commentId)
      .select(
        "comment.id",
        "comment.message",
        "comment.date",
        "comment.post_id",
        "users.firstname",
        "users.lastname",
        "users.photo",
        "users.username"
      )
      .first();

    return response.json(comment);
  };

  update = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { id } = response.locals.user.data;
    const { commentId } = request.params;
    const { message } = request.body;

    try {
      const comment: IComment = await knex("comment")
        .where("id", commentId)
        .first();

      if (!comment) throw new AppError("This comment does not exist.");

      if (comment.user_id !== id) {
        throw new AppError(
          "This comment is not yours, so you cannot update it."
        );
      }

      await knex("comment")
        .where("id", commentId)
        .andWhere("user_id", id)
        .update({ message });
      return response.json({ message: "Comment updated." });
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { id } = response.locals.user.data;
    const { commentId } = request.params;
    const trx = await knex.transaction();

    try {
      const commentDel: IComment = await trx("comment")
        .where("id", commentId)
        .first();

      if (!commentDel) throw new AppError("This comment does not exist.");

      if (commentDel.user_id !== id) {
        throw new AppError(
          "This comment is not yours, so you cannot delete it"
        );
      }

      await trx("comment_like").where("comment_id", commentId).del();

      await trx("comment").where("id", commentId).del();

      trx.commit();
      return response.json({ message: "Comment deleted." });
    } catch (error) {
      next(error);
    }
  };
}

export default CommentController;
