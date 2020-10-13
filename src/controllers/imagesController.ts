import { BaseController } from './baseController';
import { HttpResponse } from '../helpers/httpResponse';
import { Request, Response } from 'express';
import { Multer } from '../helpers/multer';
import * as fs from 'fs'

import * as path from 'path'
import Image from '../models/image';
/**
 * ImageController
 * 
 * Explica el objeto de este controlador
 *  
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */
 
export class ImageController extends BaseController
{
    /**
     * El constructor
     */
    public constructor()
    {
        // Llamamos al constructor padre
        super();
    }

    /**
     * Ruta por defecto
     * 
     * @route /example/
     * @method get
     */
    public index(request:Request, response:Response)
    {
        // Envía una respuesta
        response.status(HttpResponse.Ok).send(`[OK] Mensaje de bienvenida enviado con éxito`);
    }


    /**
     * Subir una imagen al servidor
     * @route /v1/image/upload 
     * @method post 
     */

    public async uploadImage(request:Request,response:Response){

         let upload = Multer.uploadImage().single('image')

         upload(request,response,err=>{
            if(err || !request.file){
                response.status(HttpResponse.BadRequest).send('error-uploading-file')
            }else{
                Image.new(`${request.protocol}://${request.headers.host}/v1/image/get/${request.file.filename}`)
                    .then((image)=>{
                        response.status(HttpResponse.Ok).json(image.url)
                    })
            }         
            
         })
            
    }

    /**
      * Obtener una imagen del servidor
     * @route /v1/image/get/:image 
     * @method get 
     */
    public async getImage(request:Request,response:Response){

        fs.readFile( `${path.resolve(__dirname + '/../uploads/images')}/${request.params.image}`, (err, content) => {
            if (err) {
                response.status(HttpResponse.BadRequest).send('not-found')        
            } else {
                response.writeHead(200,{'Content-type':'image/jpg'});
                response.end(content);
            }
        });
            
     
    }
}
