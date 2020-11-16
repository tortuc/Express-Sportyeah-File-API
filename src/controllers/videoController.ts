import { BaseController } from './baseController';
import { HttpResponse } from '../helpers/httpResponse';
import { Request, Response } from 'express';
import { Multer } from '../helpers/multer';
import Audio from '../models/audio';
import * as fs from 'fs'

import * as path from 'path'
import Video from '../models/video';


/**
 * VideoController
 * 
 * Explica el objeto de este controlador
 *  
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */
 
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

 

    public upload(request:Request,response:Response){
       try {
           
        let upload = Multer.uploadVideo().single('video')

        upload(request,response,err=>{
            if(err || !request.file){
                console.log(err);
                
                response.status(HttpResponse.BadRequest).send('error-uploading-video')
            }else{
                Video.saveVideo({
                    name:request.file.filename,
                    size:request.file.size
                    
                })
                    .then((video)=>{
                        
                        response.status(HttpResponse.Ok).json(
                            `${request.protocol}://${request.headers.host}/v1/video/get/${request.file.filename}`
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
      * Obtener un video del servidor
     * @route /v1/video/get/:video 
     * @method get 
     */
    public async getVideo(request:Request,response:Response){

        fs.readFile( `${path.resolve(__dirname + '/../uploads/videos')}/${request.params.video}`, (err, content) => {
            if (err) {
                response.status(HttpResponse.BadRequest).send('not-found')        
            } else {
                response.writeHead(200,{'Content-type':'video/ogg'});
                response.end(content);
            }
        });
            
     
    }


}
