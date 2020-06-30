import { Request, Response } from "express";
import knex from "@database/connection";

class UploadController {
  updatePicture = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const { id: idUser } = response.locals.user.data;
    const { key, location: url } = request.file;

    const updatePic = {
      photo: url || key,
    };

    await knex("users").where("id", idUser).update(updatePic);
    return response.json({ message: "Photo updated." });
  };
}

export default UploadController;
