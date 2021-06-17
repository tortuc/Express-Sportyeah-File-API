import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import { Multer } from "../helpers/multer";
import * as fs from "fs";
import * as path from "path";
import Image from "../models/image";
import https = require("https");
import { Environment } from "../helpers/environment";
import { AWSS3 } from "../helpers/awss3";
/**
 * ImageController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */

export class ImageController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  /**
   * Ruta por defecto
   *
   * @route /example/
   * @method get
   */
  public index(request: Request, response: Response) {
    // Envía una respuesta
    response
      .status(HttpResponse.Ok)
      .send(
        `[OK] Mensaje de bienvenida enviado con éxito ${Environment.get()} ${
          process.env.NODE_ENV
        } ${process.env.bucket}`
      );
  }

  /**
   * Subir una imagen al servidor
   * @route /v1/image/upload
   * @method post
   */

  public async uploadImage(request: Request, response: Response) {
    let upload = Multer.uploadAny().single("image");

    upload(request, response, (err) => {
      if (err || !request.file) {
        response.status(HttpResponse.BadRequest).send("error-uploading-file");
      } else {
        const bucket = process.env.bucket || "sportyeah-test";
        const originalPath = path.resolve(
          __dirname + `/../uploads/${request.file.filename}`
        );
        AWSS3.uploadToS3(
          originalPath,
          `images/${request.file.filename}`,
          bucket
        )
          .then(async (data) => {
            console.log("success", data);
            fs.unlinkSync(originalPath);
            Image.new(
              `${
                Environment.get() === Environment.Production ? "https" : "http"
              }://${request.headers.host}/v1/image/get/${
                request.file.filename
              }`,
              request.file.size
            ).then((image) => {
              response.status(HttpResponse.Ok).json(image.url);
            });
          })
          .catch((err) => {
            console.log("err", err);
          });
      }
    });
  }

  /**
   * Obtener una imagen del servidor
   * @route /v1/image/get/:image
   * @method get
   */
  public async getImage(request: Request, response: Response) {
    try {
      const Bucket = process.env.bucket || "sportyeah-test";

      const data = await AWSS3.s3
        .getObject({
          Bucket,
          Key: `images/${request.params.image}`,
        })
        .promise();

      response.writeHead(200, { "Content-type": "image/jpg" });
      response.end(data.Body);
    } catch (error) {
      fs.readFile(
        `${path.resolve(__dirname + "/../uploads/images")}/${
          request.params.image
        }`,
        (err, content) => {
          if (err) {
            response.status(HttpResponse.BadRequest).send("not-found");
          } else {
            response.writeHead(200, { "Content-type": "image/jpg" });
            response.end(content);
          }
        }
      );
    }
  }

  /**
   * Subir imagen desde URL
   * @route /v1/image/uploadFromUrl
   * @method POST
   */
  public async uploadImageFromUrl(request: Request, response: Response) {
    const { url } = request.body;

    var imageName = Date.now() + ".jpg";
    var file = fs.createWriteStream(
      path.resolve(__dirname + "/../uploads/images/" + imageName)
    );

    var res = https.get(url, (resp) => {
      if (resp.statusCode == 200) {
        resp.pipe(file);

        console.log(
          fs.statSync(
            path.resolve(__dirname + "/../uploads/images/" + imageName)
          )
        );

        Image.new(
          `${
            Environment.get() === Environment.Development ? "http" : "https"
          }://${request.headers.host}/v1/image/get/${imageName}`,
          0
        ).then((image) => {
          response.status(HttpResponse.Ok).json(image.url);
        });
      } else {
        response.status(HttpResponse.BadRequest).send("error-uploading-file");
      }
    });
  }

  public async getTotalImages(request: Request, response: Response) {
    let images = await Image.totalImages();
    let info = await Image.totalSizeImages();
    let size = `${(info[0].totalSize / 1000000 / 1000).toFixed(2)} GB`;
    response.status(HttpResponse.Ok).json({ images, size });
  }
}
