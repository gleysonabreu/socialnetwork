import { Request, Response, NextFunction } from "express";
import knex from "@database/connection";
import AppError from "../AppError";

class FollowerController {
  create = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { id } = response.locals.user.data;
    const { userFollowing } = request.params;

    try {
      const user = await knex("users").where("id", userFollowing).first();
      const followers = await knex("followers")
        .where("user_follower", id)
        .andWhere("user_following", userFollowing)
        .first();

      if (!user) throw new AppError("User does not exist.");

      if (followers) throw new AppError("You are already following this user");

      const dataFollower = {
        user_follower: id,
        user_following: userFollowing,
      };
      await knex("followers").insert(dataFollower);

      return response.json({ message: "You are following this user." });
    } catch (error) {
      next(error);
    }
  };

  index = async (request: Request, response: Response): Promise<Response> => {
    const { userFollower } = request.params;

    const users = await knex("followers")
      .innerJoin("users", function user() {
        this.on("followers.user_following", "=", "users.id");
      })
      .select(
        "followers.user_follower",
        "followers.user_following",
        "followers.date",
        "users.firstname",
        "users.lastname",
        "users.username",
        "users.photo"
      )
      .where("followers.user_follower", userFollower);

    return response.json(users);
  };

  delete = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { id } = response.locals.user.data;
    const { userFollowing } = request.params;

    try {
      const followers = await knex("followers")
        .where("user_follower", id)
        .andWhere("user_following", userFollowing)
        .first();

      if (!followers)
        throw new AppError(
          "You are not following this user to stop following him."
        );

      await knex("followers")
        .where("user_follower", id)
        .andWhere("user_following", userFollowing)
        .del();

      return response.json({
        message: "You are no longer following this user.",
      });
    } catch (error) {
      next(error);
    }
  };
}

export default FollowerController;
