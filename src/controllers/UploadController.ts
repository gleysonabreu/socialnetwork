import { Request, Response } from "express";
import jwt from "jsonwebtoken";

require("dotenv/config");

interface IToken {
  data: {
    id: number;
  };
}
class UploadController {
  create = async (request: Request, response: Response): Promise<Response> => {
    const { authorization } = request.headers;
    const tokenAuth = authorization.split(" ")[1];
    const { key, location: url = "" } = request.file;

    try {
      const decodedToken = <IToken>(
        jwt.verify(tokenAuth, process.env.SECRET_KEY)
      );

      return response.json({ key, url });
    } catch (error) {
      return response.json({ message: "Invalid token." });
    }
  };
}

export default UploadController;
