import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import knex from "@database/connection";

require("dotenv/config");

interface IPost {
  id: number;
  message: string;
  // eslint-disable-next-line camelcase
  user_id: number;
}

interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  photo: string;
}

interface IToken {
  data: {
    id: number;
  };
}

class PostController {
  create = async (request: Request, response: Response): Promise<Response> => {
    const { authorization } = request.headers;
    const tokenAuth = authorization.split(" ")[1];
    const { message } = request.body;

    try {
      const decodedToken = <IToken>(
        jwt.verify(tokenAuth, process.env.SECRET_KEY)
      );

      const dataPost = {
        message,
        user_id: decodedToken.data.id,
      };

      await knex("posts").insert(dataPost);

      return response.json({ success: true });
    } catch (error) {
      return response.status(400).json({ message: "Invalid token." });
    }
  };

  index = async (request: Request, response: Response): Promise<Response> => {
    const { authorization } = request.headers;
    const tokenAuth = authorization.split(" ")[1];

    try {
      const decodedToken = <IToken>(
        jwt.verify(tokenAuth, process.env.SECRET_KEY)
      );

      const posts = await knex("posts")
        .innerJoin("users", function postUser() {
          this.on("posts.user_id", "=", "users.id");
        })
        .whereIn("posts.user_id", function postUserIn() {
          this.select("user_following")
            .from("followers")
            .where("user_follower", decodedToken.data.id);
        })
        .select(
          "posts.id",
          "posts.message",
          "posts.date",
          "users.id as user_id",
          "users.firstname",
          "users.lastname",
          "users.username",
          "users.photo"
        )
        .orderBy("posts.id", "desc");

      return response.json(posts);
    } catch (error) {
      return response.status(400).json({ message: "Invalid token." });
    }
  };

  show = async (request: Request, response: Response): Promise<Response> => {
    const { id } = request.params;

    try {
      const post = await knex("posts")
        .innerJoin("users", function postUser() {
          this.on("posts.user_id", "users.id");
        })
        .where("posts.id", "=", id)
        .select(
          "posts.id",
          "posts.message",
          "posts.date",
          "users.id as user_id",
          "users.firstname",
          "users.lastname",
          "users.username",
          "users.photo"
        )
        .first();

      return response.json(post);
    } catch (error) {
      return response.status(400).json({ messgae: "Invalid token." });
    }
  };

  update = async (request: Request, response: Response): Promise<Response> => {
    const { authorization } = request.headers;
    const tokenAuth = authorization.split(" ")[1];
    const { id } = request.params;
    const { message } = request.body;

    try {
      const decodedToken = <IToken>(
        jwt.verify(tokenAuth, process.env.SECRET_KEY)
      );
      const post: IPost = await knex("posts").where("id", id).first();
      if (decodedToken.data.id !== post.user_id) {
        return response
          .status(400)
          .json({ message: "This post is not your, so you cannot update." });
      }
      await knex("posts").where("id", "=", id).update({ message });
      return response.json({ message: "Updated post." });
    } catch (error) {
      return response.status(400).json({ message: "Invalid token." });
    }
  };

  delete = async (request: Request, response: Response): Promise<Response> => {
    const { authorization } = request.headers;
    const tokenAuth = authorization.split(" ")[1];
    const { id } = request.params;
    const trx = await knex.transaction();

    try {
      const decodedToken = <IToken>(
        jwt.verify(tokenAuth, process.env.SECRET_KEY)
      );
      const post: IPost = await trx("posts").where("id", "=", id).first();
      if (post.user_id === decodedToken.data.id) {
        await trx("comment_like")
          .whereIn("comment_id", function wI() {
            this.select("id").from("comment").where("post_id", "=", post.id);
          })
          .del();

        await trx("comment").where("post_id", "=", post.id).del();

        await trx("post_image").where("post_id", "=", post.id).del();

        await trx("post_like").where("post_id", "=", post.id).del();

        await trx("posts").where("id", "=", post.id).del();
        trx.commit();
        return response.json({ message: "Post deleted." });
      }
      return response
        .status(400)
        .json({ message: "This post is not yours, so you cannot delete it." });
    } catch (error) {
      return response.status(400).json({ message: "Invalid token" });
    }
  };
}

export default PostController;
