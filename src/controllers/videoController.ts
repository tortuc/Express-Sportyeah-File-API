import { BaseController } from './baseController';
import { HttpResponse } from '../helpers/httpResponse';
import { Request, Response } from 'express';
import { Multer } from '../helpers/multer';
import { Watermark } from '../helpers/watermark';
import Audio from '../models/audio';
import * as fs from 'fs'
const exec = require("child_process").execSync;

//var ffmpeg = require('ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
import * as path from 'path'
import Video from '../models/video';
import https = require('https');
import { Environment } from '../helpers/environment';

/**
 * VideoController
 *
 * Explica el objeto de este controlador
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */

 async function myAwesomeFunction() {
    setTimeout(() => {}, 100, "foo");
  }

export class VideoController extends BaseController
{
    /**
     * El constructor
     */
    public constructor()
    {
        // Llamamos al constructor padre
        super();
    }





    public async upload(request:Request,response:Response){
       try {

        console.log('uploading video...');

        const VIDEO_PATH = path.resolve(__dirname + '/../uploads/videos/')+'/1621899462674.mp4';
        const WATERMARK_PATH = path.resolve(__dirname + '/../uploads/videos/')+'/logo-hive.png';

        let upload = Multer.uploadVideo().single('video')

        console.log('video...');


        upload(request,response,err=>{
            console.log('video cargado');

            if(err || !request.file){
                console.log(err);

                response.status(HttpResponse.BadRequest).send('error-uploading-video')
            }else{
                Video.saveVideo({
                    name:request.file.filename,
                    size:request.file.size

                })
                    .then((video)=>{

                        console.log(request.body)

                        const watermarkR = new Watermark();
                        watermarkR.createVideoWatermark(request.file.filename,request.body.user)

                        response.status(HttpResponse.Ok).json(
                            `${Environment.get() === Environment.Production?'https':'http'}://${request.headers.host}/v1/video/get/${request.file.filename}`
                        )
                    })
                    .catch((err)=>{
                        console.log(err);

                                    response.status(HttpResponse.BadRequest).send('error-uploading-video')

                    })
            }

         })
       } catch (error) {
           console.log(error);

       }


    }

    /**
      * Subir video desde URL
     * @route /v1/video/uploadFromUrl
     * @method post
     */

    public async uploadVideoFromUrl(request:Request,response:Response) {
        const { url } = request.body;

        var videoName = Date.now()+'.mp4';
        var file = fs.createWriteStream(path.resolve(__dirname + '/../uploads/videos/'+videoName));

        var res = https.get(url, ( resp ) => {
            const realUrl = resp.headers.location;
            https.get(realUrl, ( resp ) => {
                if(resp.statusCode == 200) {
                    resp.pipe(file)
                    response.status(HttpResponse.Ok).json(
                        `${Environment.get() === Environment.Production?'https':'http'}://${request.headers.host}/v1/video/get/${videoName}`
                    )
                }else{
                    response.status(HttpResponse.BadRequest).send('error-uploading-file')
                }
            })
        })

    }

     /**
      * Obtener un video del servidor
     * @route /v1/video/get/:video
     * @method get
     */
    public async getVideo(request:Request,response:Response){

        fs.readFile( `${path.resolve(__dirname + '/../uploads/videos')}/${request.params.video}.mp4`, (err, content) => {
            if (err) {
                response.status(HttpResponse.BadRequest).send('not-found')
            } else {
                response.writeHead(200,{'Content-type':'video/ogg'});
                response.end(content);
            }
        });


    }


}
