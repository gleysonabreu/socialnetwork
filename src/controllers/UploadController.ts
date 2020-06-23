import { Request, Response } from "express";

class UploadController {
  create = async (request: Request, response: Response): Promise<Response> => {
    return response.json({ message: "Hello world." });
  };
}

export default UploadController;
