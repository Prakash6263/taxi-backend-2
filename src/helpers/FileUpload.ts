import { S3 } from "aws-sdk";
import { env } from "../environments/Env";
import * as path from "path";
import * as os from "os";
import AWS = require("aws-sdk");
const fs = require("fs");

AWS.config.update({
  accessKeyId: env().awsAccessKey,
  secretAccessKey: env().awsSecretKey,
  region: env().region,
});

export class FileUpload {
  constructor() {}
  static s3 = new AWS.S3();
  static async uploadInS3(image, path, fileExtension) {
    let folderPath = path;
    const imageRemoteName = `${folderPath}/${
      image.name
    }${new Date().getTime()}${fileExtension}`;
    try {
      const response = await FileUpload.s3
        .putObject({
          Bucket: env().s3Bucket,
          Body: fs.readFileSync(image.path),
          ContentType: image.type,
          Key: imageRemoteName,
        })
        .promise();
      // .then((response) => {
      //   console.log(response);
      //   return imageRemoteName;
      // })
      // .catch((err) => {
      //   console.log("failed:", err);
      //   return false;
      // });

      return imageRemoteName;
    } catch (err) {
      console.log("Failed:", err);
      return false;
    }
    // return FileUpload.s3
    //   .putObject({
    //     Bucket: env().s3Bucket,
    //     Body: fs.readFileSync(image.path),
    //     ContentType: image.type,
    //     Key: imageRemoteName,
    //   })
    //   .promise()
    //   .then((response) => {
    //     console.log(response);
    //     return imageRemoteName;
    //   })
    //   .catch((err) => {
    //     console.log("failed:", err);
    //     return false;
    //   });
  }

  static deleteFromS3(path) {
    const params = {
      Bucket: env().s3Bucket,
      Delete: {
        Objects: [
          {
            Key: path,
          },
        ],
      },
    };
    return FileUpload.s3
      .deleteObjects(params)
      .promise()
      .then((response) => {
        console.log("Deleted success", response);
        return true;
      })
      .catch((error) => {
        console.log("failed:", error);
        return false;
      });
  }
}

export default FileUpload;
