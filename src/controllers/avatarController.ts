import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import { Multer } from "../helpers/multer";
import * as fs from "fs";

import * as path from "path";
import Avatar from "../models/avatar";
import { Environment } from "../helpers/environment";
import { AWSS3 } from "../helpers/awss3";
/**
 * AvatarController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */

export class AvatarController extends BaseController {
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
      .send(`[OK] Mensaje de bienvenida enviado con éxito`);
  }

  /**
   * Subir un Avatar al servidor
   * @route /v1/avatar/upload
   * @method post
   */

  public uploadAvatar(request: Request, response: Response) {
    let upload = Multer.uploadAny().single("avatar");

    upload(request, response, (err) => {
      if (err || !request.file) {
        response.status(HttpResponse.BadRequest).send("error-uploading-file");
      } else {
        const bucket = AWSS3.getBucket();
        const originalPath = request.file.path;
        AWSS3.uploadToS3(originalPath, `avatares/${request.file.filename}`)
          .then(async (data) => {
            fs.unlinkSync(originalPath);
            Avatar.new(
              `${
                Environment.get() === Environment.Development ? "http" : "https"
              }://${request.headers.host}/v1/avatar/get/${
                request.file.filename
              }`
            ).then((avatar) => {
              response.status(HttpResponse.Ok).json(avatar);
            });
          })
          .catch((err) => {
            response.status(HttpResponse.BadRequest).send(err)
          });
      }
    });
  }

  /**
   * Obtener una imagen del servidor
   * @route /v1/image/get/:image
   * @method get
   */
  public async getAvatar(request: Request, response: Response) {
    try {
        const Bucket = process.env.bucket || "sportyeah-test";
  
        const data = await AWSS3.s3
          .getObject({
            Bucket,
            Key: `avatares/${request.params.avatar}`,
          })
          .promise();
  
        response.writeHead(200, { "Content-type": "image/jpg" });
        response.end(data.Body);
      } catch (error) {
        fs.readFile(
            `${path.resolve(__dirname + "/../uploads/avatars")}/${
              request.params.avatar
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

  public getAvatars(request: Request, response: Response) {
    Avatar.findAll()
      .then((avatars) => {
        response.status(HttpResponse.Ok).json(avatars);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("Something wrong");
      });
  }

  public deleteAvatar(request: Request, response: Response) {
    Avatar.delete(request.params.id)
      .then((avatar) => {
        response.status(HttpResponse.Ok).json(avatar);
      })
      .catch(() => {
        response.status(HttpResponse.BadRequest).send("Something wrong");
      });
  }
}
