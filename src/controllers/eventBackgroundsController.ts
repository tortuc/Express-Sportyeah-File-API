import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import { Multer } from "../helpers/multer";
import * as fs from "fs";
import * as path from "path";
import EventBackground from "../models/eventBackground";
import { Environment } from "../helpers/environment";
/**
 * AvatarController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */

export class EventBackgroundController extends BaseController {
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

  public uploadBackground(request: Request, response: Response) {
    let upload = Multer.uploadBackground().single("background");
    let appName = request.params.app
    let typeEvent = request.params.type
    upload(request, response, (err) => {
      if (err || !request.file) {
        console.log(err, request.file);

        response.status(HttpResponse.BadRequest).send("error-uploading-file");
      } else {
        EventBackground.new({
          url: `${Environment.get() === Environment.Production?'https':'http'}://${request.headers.host}/v1/background/get/${request.file.filename}`,
          appName,
          typeEvent
        }).then((background) => {
          response.status(HttpResponse.Ok).json(background);
        });
      }
    });
  }

  /**
   * Obtener una imagen del servidor
   * @route /v1/image/get/:image
   * @method get
   */
  public getbackground(request: Request, response: Response) {
    fs.readFile(
      `${path.resolve(__dirname + "/../uploads/backgrounds")}/${
        request.params.background
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

  public getbackgrounds(request: Request, response: Response) {
      let appName = request.params.app 
      let type = request.params.type
    EventBackground.findAllByType(appName,type)
      .then((backgrounds) => {
        let resp = {
          backgrounds,
          urls: backgrounds.map((x)=>x.url)
        }
        response.status(HttpResponse.Ok).json(resp);
      })
      .catch((err) => {
        response.status(HttpResponse.BadRequest).send("Something wrong");
      });
  }

  public deleteBackground(request: Request, response: Response) {
    EventBackground.delete(request.params.id)
      .then(() => {
        response.status(HttpResponse.Ok).json({ ok: true });
      })
      .catch(() => {
        response.status(HttpResponse.BadRequest).send("Something wrong");
      });
  }
}
