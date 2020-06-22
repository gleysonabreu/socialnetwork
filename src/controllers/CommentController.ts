import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import knex from "@database/connection";

require("dotenv/config");

interface IComment {
  id: number;
  message: string;
  // eslint-disable-next-line camelcase
  user_id: number;
  // eslint-disable-next-line camelcase
  post_id: number;
  date: string;
}

interface IToken {
  data: {
    id: number;
  };
}

class CommentController {
  create = async (request: Request, response: Response): Promise<Response> => {
    const { authorization } = request.headers;
    const tokenAuth = authorization.split(" ")[1];
    const { message, postId } = request.body;

    try {
      const decodedToken = <IToken>(
        jwt.verify(tokenAuth, process.env.SECRET_KEY)
      );
      const dataComment = {
        message,
        user_id: decodedToken.data.id,
        post_id: postId,
      };

      const post = await knex("posts").where("id", postId).first();

      if (!post) {
        return response
          .status(400)
          .json({ message: "Post not found, so you cannot comment it." });
      }

      await knex("comment").insert(dataComment);
      return response.json({ success: true });
    } catch (error) {
      return response.status(400).json({ message: "Invalid token" });
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
    const { postId, commentId } = request.params;
    const comment = await knex("comment")
      .innerJoin("users", function commentUsers() {
        this.on("comment.user_id", "users.id");
      })
      .where("comment.post_id", postId)
      .andWhere("comment.id", commentId)
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

  update = async (request: Request, response: Response): Promise<Response> => {
    const { authorization } = request.headers;
    const tokenAuth = authorization.split(" ")[1];
    const { commentId } = request.params;
    const { message } = request.body;

    try {
      const decodedToken = <IToken>(
        jwt.verify(tokenAuth, process.env.SECRET_KEY)
      );
      const comment: IComment = await knex("comment")
        .where("id", commentId)
        .first();

      if (comment.user_id !== decodedToken.data.id) {
        return response.status(400).json({
          message: "This comment is not yours, so you cannot update it.",
        });
      }

      await knex("comment")
        .where("id", commentId)
        .andWhere("user_id", decodedToken.data.id)
        .update({ message });
      return response.json({ success: true });
    } catch (error) {
      return response.status(400).json({ message: "Invalid token." });
    }
  };

  delete = async (request: Request, response: Response): Promise<Response> => {
    const { authorization } = request.headers;
    const tokenAuth = authorization.split(" ")[1];
    const { commentId } = request.params;
    const trx = await knex.transaction();

    try {
      const decodedToken = <IToken>(
        jwt.verify(tokenAuth, process.env.SECRET_KEY)
      );
      const commentDel: IComment = await trx("comment")
        .where("id", commentId)
        .first();

      if (commentDel.user_id !== decodedToken.data.id) {
        return response.status(400).json({
          message: "This comment is not yours, so you cannot delete it",
        });
      }

      await trx("comment_like").where("comment_id", commentId).del();

      await trx("comment").where("id", commentId).del();

      trx.commit();
      return response.json({ success: true });
    } catch (error) {
      return response.status(400).json({ message: "Invalid token" });
    }
  };
}

export default CommentController;
