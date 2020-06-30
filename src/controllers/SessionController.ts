// eslint-disable-next-line no-unused-vars
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import knex from "@database/connection";
import bcrypt from "bcrypt";
import IUser from "@dtos/IUser";

require("dotenv/config");

class SessionController {
  create = async (request: Request, response: Response): Promise<Response> => {
    const { login, password } = request.body;

    const user: IUser = await knex("users")
      .where(function query() {
        this.where("email", login).orWhere("username", login);
      })
      .first();

    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const dataUser = {
            id: user.id,
          };

          jwt.sign(
            { data: dataUser },
            process.env.SECRET_KEY,
            { algorithm: "HS256", expiresIn: "10d" },
            (error, token) => {
              if (token) return response.json({ token });
              return response.json({ message: error.message });
            }
          );
        } else {
          return response.json({
            message: "Password or email/username incorrect!!",
          });
        }
      });
    } else {
      return response.json({
        message: "Password or email/username incorrect!!",
      });
    }
  };
}

export default SessionController;
