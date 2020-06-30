import { Request, Response, NextFunction } from "express";
import knex from "@database/connection";
import IPost from "@dtos/IPost";
import IPostUser from "@dtos/IPostUser";
import AppError from "../AppError";
import ConvertFileNames from "../utils/PostUpload";
import ImageLink from "../utils/ImageLink";

class PostController {
  create = async (request: Request, response: Response): Promise<Response> => {
    const { id } = response.locals.user.data;
    const { message } = request.body;
    const images = ConvertFileNames(request);

    const trx = await knex.transaction();

    const dataPost = {
      message,
      user_id: id,
    };

    const post = await trx("posts").returning("id").insert(dataPost);
    const postId = post[0];

    const postImages = images.map((item: string) => {
      return {
        post_id: postId,
        url: item,
      };
    });

    await trx("post_image").insert(postImages);

    await trx.commit();

    return response.json({ message: "Post done" });
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

    const serializable = posts.map((post) => {
      return {
        ...post,
        photo: `http://localhost:3333/temp/uploads/${post.photo}`,
        images: post.images ? ImageLink(post.images) : null,
      };
    });

    return response.json(serializable);
  };

  show = async (request: Request, response: Response): Promise<Response> => {
    const { id } = request.params;

    const post: IPostUser = await knex("posts")
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

    const imagesLinks = post.images ? ImageLink(post.images) : null;
    const serializable = {
      ...post,
      photo: `http://localhost:3333/temp/uploads/${post.photo}`,
      images: imagesLinks,
    };

    return response.json(serializable);
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
