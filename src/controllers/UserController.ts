import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import knex from "@database/connection";
import bcrypt from "bcrypt";

require("dotenv/config");

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

interface IToken {
  data: {
    id: number;
  };
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

    try {
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

        return response.json({ success: true });
      });
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Unable to register user, please try again." });
    }
  };

  show = async (request: Request, response: Response): Promise<Response> => {
    const { authorization } = request.headers;
    const tokenAuth = authorization.split(" ")[1];
    const { userId } = request.params;

    try {
      jwt.verify(tokenAuth, process.env.SECRET_KEY);
      const user: IUser = await knex("users")
        .where("id", userId)
        .select("id", "firstname", "lastname", "email", "username", "photo")
        .first();
      if (!user) {
        return response.status(400).json({ message: "User not found." });
      }

      return response.json(user);
    } catch (error) {
      return response.status(400).json({ message: "Invalid token" });
    }
  };

  update = async (request: Request, response: Response): Promise<Response> => {
    const { authorization } = request.headers;
    const tokenAuth = authorization.split(" ")[1];
    const { firstname, lastname } = request.body;

    try {
      const decodedToken = <IToken>(
        jwt.verify(tokenAuth, process.env.SECRET_KEY)
      );
      const updateUser = {
        firstname,
        lastname,
      };
      const user: IUser = await knex("users")
        .where("id", decodedToken.data.id)
        .first();
      if (!user) {
        return response.status(400).json({ message: "User not found." });
      }

      await knex("users").where("id", decodedToken.data.id).update(updateUser);
      return response.json({ success: true });
    } catch (error) {
      return response.status(400).json({ message: "Invalid token." });
    }
  };
}

export default UserController;
