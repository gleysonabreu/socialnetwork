import multer from "multer";
import path from "path";
import crypto from "crypto";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

require("dotenv/config");

const storageTypes = {
  local: multer.diskStorage({
    destination: (request, file, cb): any => {
      cb(null, path.resolve(__dirname, "..", "..", "temp", "uploads"));
    },
    filename: (request, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err, null);
        file.key = `${hash.toString("hex")}-${file.originalname}`;
        cb(null, file.key);
      });
    },
  }),

  s3: multerS3({
    s3: new aws.S3(),
    bucket: "upload-socialnetowork",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (request, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err, null);

        const filename = `${hash.toString("hex")}-${file.originalname}`;

        cb(null, filename);
      });
    },
  }),
};

const multerConfig = {
  dest: path.resolve(__dirname, "..", "..", "temp", "uploads"),
  storage: storageTypes.local,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (request, file, cb): any => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  },
};

export default multerConfig;
