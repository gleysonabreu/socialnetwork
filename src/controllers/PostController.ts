import { Request, Response, NextFunction } from "express";
import knex from "@database/connection";
import AppError from "../AppError";

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

class PostController {
  create = async (request: Request, response: Response): Promise<Response> => {
    const { id } = response.locals.user.data;
    const { message } = request.body;

    const dataPost = {
      message,
      user_id: id,
    };

    await knex("posts").insert(dataPost);

    return response.json({ message: "Post done." });
  };

  index = async (request: Request, response: Response): Promise<Response> => {
    const { id } = response.locals.user.data;

    const posts = await knex("posts")
      .innerJoin("users", function postUser() {
        this.on("posts.user_id", "=", "users.id");
      })
      .leftJoin("post_image", function images() {
        this.on("posts.id", "post_image.post_id");
      })
      .whereIn("posts.user_id", function postUserIn() {
        this.select("user_following")
          .from("followers")
          .where("user_follower", id);
      })
      .select(
        "posts.id",
        "posts.message",
        "posts.date",
        "users.id as user_id",
        "users.firstname",
        "users.lastname",
        "users.username",
        "users.photo",
        knex.raw("string_agg(post_image.url, ',') as images")
      )
      .groupBy(
        "posts.id",
        "posts.message",
        "posts.date",
        "users.id",
        "users.firstname",
        "users.lastname",
        "users.username",
        "users.photo"
      )
      .orderBy("posts.id", "desc");

    return response.json(posts);
  };

  show = async (request: Request, response: Response): Promise<Response> => {
    const { id } = request.params;

    const post = await knex("posts")
      .select(
        "posts.id",
        "posts.message",
        "posts.date",
        "users.id as user_id",
        "users.firstname",
        "users.lastname",
        "users.username",
        "users.photo",
        knex.raw("string_agg(post_image.url, ',') as images")
      )
      .innerJoin("users", function postUser() {
        this.on("posts.user_id", "users.id");
      })
      .leftJoin("post_image", function images() {
        this.on("posts.id", "post_image.post_id");
      })
      .where("posts.id", "=", id)
      .groupBy(
        "posts.id",
        "posts.message",
        "posts.date",
        "users.firstname",
        "users.lastname",
        "users.username",
        "users.photo",
        "users.id"
      )
      .first();

    return response.json(post);
  };

  update = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { id: idUser } = response.locals.user.data;
    const { id } = request.params;
    const { message } = request.body;

    try {
      const post: IPost = await knex("posts").where("id", id).first();

      if (!post) throw new AppError("This post does not exist.");

      if (idUser !== post.user_id)
        throw new AppError("This post is not your, so you cannot update.");

      await knex("posts").where("id", "=", id).update({ message });
      return response.json({ message: "Updated post." });
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { id: idUser } = response.locals.user.data;
    const { id } = request.params;
    const trx = await knex.transaction();

    try {
      const post: IPost = await trx("posts").where("id", "=", id).first();

      if (!post) throw new AppError("This post does not exist.");

      if (post.user_id !== idUser)
        throw new AppError("This post is not yours, so you cannot delete it.");

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
    } catch (error) {
      next(error);
    }
  };
}

export default PostController;
