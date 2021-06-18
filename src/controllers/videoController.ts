import { BaseController } from "./baseController";
import { HttpResponse } from "../helpers/httpResponse";
import { Request, Response } from "express";
import { Multer } from "../helpers/multer";
import * as fs from "fs";

import * as path from "path";
import Video from "../models/video";
import https = require("https");
import { Environment } from "../helpers/environment";
import { FFMPEG } from "../helpers/ffmpeg";
import { AWSS3 } from "../helpers/awss3";

/**
 * VideoController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */

export class VideoController extends BaseController {
  /**
   * El constructor
   */
  public constructor() {
    // Llamamos al constructor padre
    super();
  }

  public upload(request: Request, response: Response) {
    try {
      let upload = Multer.uploadAny().single("video");

      upload(request, response, (err) => {
        if (err || !request.file) {
          console.log(err);

          response
            .status(HttpResponse.BadRequest)
            .send("error-uploading-video");
        } else {
          
          const originalPath = request.file.path;
          const name = request.file.filename;
          const key = `videos/${name}`;
          AWSS3.uploadToS3(originalPath, key)
            .then((data) => {
              fs.unlinkSync(originalPath);
              Video.saveVideo({
                name: name,
                size: request.file.size,
              }).then((video) => {
                response
                  .status(HttpResponse.Ok)
                  .json(
                    `${
                      Environment.get() === Environment.Development
                        ? "http"
                        : "https"
                    }://${request.headers.host}/v1/video/get/${name}`
                  );
              });
            })
            .catch((err) => {
              response.status(HttpResponse.BadRequest).send(err);
            });

          // if (process.env.app != "sportyeah") {

          // } else {
          //   FFMPEG.concatVideo(videopath)
          //     .then((newname) => {
          //       Video.saveVideo({
          //         name: newname,
          //         size: request.file.size,
          //       })
          //         .then((video) => {
          //           response
          //             .status(HttpResponse.Ok)
          //             .json(
          //               `${
          //                 Environment.get() === Environment.Production
          //                   ? "https"
          //                   : "http"
          //               }://${request.headers.host}/v1/video/get/${newname}`
          //             );
          //         })
          //         .catch((err) => {
          //           console.log(err);

          //           response
          //             .status(HttpResponse.BadRequest)
          //             .send("error-uploading-video");
          //         });
          //     })
          //     .catch((err) => {
          //       console.log(err);

          //       response
          //         .status(HttpResponse.BadRequest)
          //         .send("error-uploading-video");
          //     });
          // }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Subir video desde URL
   * @route /v1/video/uploadFromUrl
   * @method post
   */

  public async uploadVideoFromUrl(request: Request, response: Response) {
    const { url } = request.body;

    var videoName = Date.now() + ".mp4";
    var file = fs.createWriteStream(
      path.resolve(__dirname + "/../uploads/videos/" + videoName)
    );

    var res = https.get(url, (resp) => {
      const realUrl = resp.headers.location;
      https.get(realUrl, (resp) => {
        if (resp.statusCode == 200) {
          resp.pipe(file);
          response
            .status(HttpResponse.Ok)
            .json(
              `${
                Environment.get() === Environment.Development ? "http" : "https"
              }://${request.headers.host}/v1/video/get/${videoName}`
            );
        } else {
          response.status(HttpResponse.BadRequest).send("error-uploading-file");
        }
      });
    });
  }

  /**
   * Obtener un video del servidor
   * @route /v1/video/get/:video
   * @method get
   */
  public async getVideo(request: Request, response: Response) {
    const video = request.params.video;
    try {
      const Bucket = process.env.bucket || "sportyeah-test";

      const data = await AWSS3.s3
        .getObject({
          Bucket,
          Key: `videos/${video}`,
        })
        .promise();

      response.writeHead(200, { "Content-type": "video/ogg" });
      response.end(data.Body);
    } catch (error) {
      fs.readFile(
        `${path.resolve(__dirname + "/../uploads/videos")}/${video}`,
        (err, content) => {
          if (err) {
            response.status(HttpResponse.BadRequest).send("not-found");
          } else {
            response.writeHead(200, { "Content-type": "video/ogg" });
            response.end(content);
          }
        }
      );
    }
  }

  public async getTotalVideos(request: Request, response: Response) {
    let videos = await Video.totalVideos();
    let info = await Video.totalSizeVideos();
    let size = `${(info[0].totalSize / 1000000 / 1000).toFixed(2)} GB`;
    response.status(HttpResponse.Ok).json({ videos, size });
  }

  public testFfmpeg(request: Request, response: Response) {
    FFMPEG.resizeEnding();
    response.status(HttpResponse.Ok).json({ testing: true });
  }
}
