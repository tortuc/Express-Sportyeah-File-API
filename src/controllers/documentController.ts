import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import { Multer } from "../helpers/multer";
import * as fs from "fs";

import * as path from "path";
import Document from "../models/document";
import { Environment } from "../helpers/environment";
import { AWSS3 } from "../helpers/awss3";
/**
 * DocumentController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */

export class DocumentController extends BaseController {
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
   * Subir un documento al servidor
   * @route /v1/document/upload
   * @method post
   */

  public async uploadDocument(request: Request, response: Response) {
    let upload = Multer.uploadAny().single("file");

    upload(request, response, (err) => {
      if (err || !request.file) {
        response.status(HttpResponse.BadRequest).send("error-uploading-file");
      } else {
        const name = request.file.filename;
        const originalPath = request.file.path;
        const key = `documents/${name}`;
        AWSS3.uploadToS3(originalPath, key)
          .then(() => {
            fs.unlinkSync(originalPath);
            Document.new(name, request.file.originalname).then((document) => {
              response.status(HttpResponse.Ok).json({
                name: document.originalName,
                url: `${
                  Environment.get() === Environment.Development
                    ? "http"
                    : "https"
                }://${request.headers.host}/v1/document/download/${name}`,
              });
            });
          })
          .catch((err) => {
            response.status(HttpResponse.BadRequest).send(err);
          });
      }
    });
  }

  /**
   * Descargar el documento del servidor
   * @route /v1/document/download/:name
   * @method get
   */
  public async dowloadDocument(request: Request, response: Response) {
    Document.findByName(request.params.name)
      .then(async (document) => {
        if (document) {
          try {
            const Bucket = process.env.bucket || "sportyeah-test";
            const fileKey = `documents/${document.name}`;
            var options = {
              Bucket,
              Key: fileKey,
            };

            response.attachment(document.originalName);
            var fileStream = AWSS3.s3.getObject(options).createReadStream();

            fileStream.pipe(response);
          } catch (error) {
            response.download(
              `${path.resolve(__dirname + "/../uploads/documents")}/${
                document.name
              }`,
              document.originalName
            );
          }
        } else {
          response.status(HttpResponse.NotFound).send("not-found");
        }
      })
      .catch((err) => {
        response.status(HttpResponse.NotFound).send("not-found");
      });
  }
}
