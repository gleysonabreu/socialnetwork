import { Request } from "express";

const ConvertFileNames = (request: Request): string[] => {
  const images = [];
  for (let index = 0; index < request.files.length; index += 1) {
    images.push(request.files[index].key);
  }

  return images;
};

export default ConvertFileNames;
