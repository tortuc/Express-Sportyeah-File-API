/**
 * Clase Crypto
 *
 * Fachada con funciones de encriptación
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 *
 * @link https://www.npmjs.com/package/bcrypt
 */

import path = require("path");
import fs = require("fs");
import AWS = require("aws-sdk");

//configuring the AWS environment
AWS.config.update({
  accessKeyId: "AKIAVAPQDXHEDVMLW5FE",
  secretAccessKey: "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",
});

var s3 = new AWS.S3();

export class AWSS3 {
  /**s
   * El constructor es privado
   */
  private constructor() {
    // Constructor Privado
  }

  /**
   * Crea un storage para las imagenes
   */

  public static s3 = s3;

  public static async uploadToS3(originalPath: string, Key: string) {
    const Bucket = this.getBucket();
    var params = {
      Bucket,
      Body: fs.createReadStream(originalPath),
      Key,
    };

    return s3.upload(params).promise();
  }

  public static getBucket(): string {
    return process.env.bucket || "sportyeah-test";
  }
}
