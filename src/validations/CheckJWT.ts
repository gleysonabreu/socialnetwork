import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../AppError";

require("dotenv/config");

const extractTokenFromHeader = (request: Request) => {
  if (
    request.headers.authorization &&
    request.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return request.headers.authorization.split(" ")[1];
  }
};

const checkJWT = (request: Request, response: Response, next: NextFunction) => {
  const token = extractTokenFromHeader(request);
  try {
    const jwtPayload = jwt.verify(token, process.env.SECRET_KEY);
    response.locals.user = jwtPayload;
  } catch (error) {
    throw new AppError("Unauthorized user.");
  }

  next();
};

export default checkJWT;
