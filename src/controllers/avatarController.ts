import { BaseController } from './baseController';
import { HttpResponse } from '../helpers/httpResponse';
import { Request, Response } from 'express';
import { Multer } from '../helpers/multer';
import * as fs from 'fs'

import * as path from 'path'
import Avatar from '../models/avatar';
import { Environment } from '../helpers/environment';
/**
 * AvatarController
 * 
 * Explica el objeto de este controlador
 *  
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */
 
export class AvatarController extends BaseController
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
     * Subir un Avatar al servidor
     * @route /v1/avatar/upload 
     * @method post 
     */

    public  uploadAvatar(request:Request,response:Response){

         let upload = Multer.uploadAvatar().single('avatar')

         upload(request,response,err=>{
            if(err || !request.file){
                console.log(err,request.file);
                
                response.status(HttpResponse.BadRequest).send('error-uploading-file')
            }else{
                Avatar.new(`${Environment.get() === Environment.Production?'https':'http'}://${request.headers.host}/v1/avatar/get/${request.file.filename}`)
                    .then((avatar)=>{
                        response.status(HttpResponse.Ok).json(avatar)
                    })
            }         
            
         })
            
    }

    /**
      * Obtener una imagen del servidor
     * @route /v1/image/get/:image 
     * @method get 
     */
    public getAvatar(request:Request,response:Response){

        fs.readFile( `${path.resolve(__dirname + '/../uploads/avatars')}/${request.params.avatar}`, (err, content) => {
            if (err) {
                response.status(HttpResponse.BadRequest).send('not-found')        
            } else {
                response.writeHead(200,{'Content-type':'image/jpg'});
                response.end(content);
            }
        });
            
     
    }


    public getAvatars(request:Request,response:Response){
        Avatar.findAll()
            .then((avatars)=>{
                response.status(HttpResponse.Ok).json(avatars)
            })
            .catch((err)=>{
                response.status(HttpResponse.BadRequest).send('Something wrong')
            })
    }

    public deleteAvatar(request:Request,response:Response){
        Avatar.delete(request.params.id)
            .then((avatar)=>{   
                response.status(HttpResponse.Ok).json(avatar)
            })
            .catch(()=>{
                response.status(HttpResponse.BadRequest).send('Something wrong')
            })
    }
}
