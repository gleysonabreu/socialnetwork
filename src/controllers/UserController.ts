import { Request, Response, NextFunction } from "express";
import knex from "@database/connection";
import bcrypt from "bcrypt";
import AppError from "../AppError";

interface IUser {
  id?: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password?: string;
  photo?: string;
  // eslint-disable-next-line camelcase
  date_birth?: string;
}

class UserController {
  create = async (request: Request, response: Response): Promise<any> => {
    const {
      firstname,
      lastname,
      username,
      email,
      dateBirth,
      password,
    } = request.body;

    const user: IUser = {
      firstname,
      lastname,
      username,
      email,
      date_birth: dateBirth,
      password,
      photo: "default",
    };
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return response
          .status(400)
          .json({ message: "Error to generate a encrypt password." });
      }

      user.password = hash;
      await knex("users").insert(user);

      return response.json({ message: "Registered user." });
    });
  };

  show = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { userId } = request.params;

    try {
      const user: IUser = await knex("users")
        .where("id", userId)
        .select("id", "firstname", "lastname", "email", "username", "photo")
        .first();

      if (!user) throw new AppError("User not found.");

      return response.json(user);
    } catch (error) {
      next(error);
    }
  };

  update = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { id: idUser } = response.locals.user.data;
    const { firstname, lastname } = request.body;

    try {
      const updateUser = {
        firstname,
        lastname,
      };
      const user: IUser = await knex("users").where("id", idUser).first();

      if (!user) throw new AppError("User not found.");

      await knex("users").where("id", idUser).update(updateUser);
      return response.json({ message: "User updated." });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
