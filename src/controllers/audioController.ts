import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import { Multer } from "../helpers/multer";
import Audio from "../models/audio";
import * as fs from "fs";

import * as path from "path";
import { Environment } from "../helpers/environment";
import { AWSS3 } from "../helpers/awss3";

/**
 * AudioController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */

export class AudioController extends BaseController {
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

  public upload(request: Request, response: Response) {
    let upload = Multer.uploadAny().single("audio");

    upload(request, response, (err) => {
      if (err || !request.file) {
        response.status(HttpResponse.BadRequest).send("error-uploading-audio");
      } else {
        console.log(request.file);
        const originalPath = request.file.path;

        const key = `audios/${request.file.filename}`
        AWSS3.uploadToS3(originalPath,key)
        .then((data)=>{
          console.log("success", data);
            fs.unlinkSync(originalPath);
          Audio.saveAudio({
            name: request.file.filename,
            size: request.file.size,
            duration: request.body.duration,
          }).then((audio) => {
            response
              .status(HttpResponse.Ok)
              .json(
                `${
                  Environment.get() === Environment.Development ? "http" : "https"
                }://${request.headers.host}/v1/audio/get/${request.file.filename}`
              );
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
  public async getAudio(request: Request, response: Response) {
    try {
      const Bucket = process.env.bucket || "sportyeah-test";

      const data = await AWSS3.s3
        .getObject({
          Bucket,
          Key: `audios/${request.params.audio}`,
        })
        .promise();

      response.writeHead(200, { "Content-type": "audio/ogg" });
      response.end(data.Body);
    } catch (error) {
      fs.readFile(
        `${path.resolve(__dirname + "/../uploads/audios")}/${
          request.params.audio
        }`,
        (err, content) => {
          if (err) {
            response.status(HttpResponse.BadRequest).send("not-found");
          } else {
            response.writeHead(200, { "Content-type": "audio/ogg" });
            response.end(content);
          }
        }
      );
    }
    
  }
}
