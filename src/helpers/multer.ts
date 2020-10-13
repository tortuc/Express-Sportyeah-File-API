/**
 * Clase Crypto
 * 
 * Fachada con funciones de encriptación
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 *
 * @link https://www.npmjs.com/package/bcrypt
 */

import * as multer from 'multer'

import * as path from 'path'

var imageStorage = multer.diskStorage({
    destination :   (req, file, cb) => {
      cb(null, path.resolve(__dirname + '/../uploads/images'))
    },
    filename    :   (req, file, cb) => {
      cb(null, Date.now() +  path.extname(file.originalname))
    }
  })

var avatarStorage = multer.diskStorage({
    destination :   (req, file, cb) => {
      cb(null, path.resolve(__dirname + '/../uploads/avatars'))
    },
    filename    :   (req, file, cb) => {
      cb(null, Date.now() +  path.extname(file.originalname))
    }
  })

  var documentStorage = multer.diskStorage({
    destination :   (req, file, cb) => {
      cb(null, path.resolve(__dirname + '/../uploads/documents'))
    },
    filename    :   (req, file, cb) => {
      cb(null, Date.now() +  path.extname(file.originalname))
    }
  })
   
   


export class Multer
{
    /**
     * El constructor es privado
     */
    private constructor()
    {
        // Constructor Privado
    }


  

      /**
     * Crea un storage para las imagenes
     */


    /**
     * Guarda una imagen en la carpteta /views/images
     */
    public static uploadImage(){
        return multer({storage:imageStorage})
    }

      /**
     * Guarda un avatar en la carpteta /views/avatars
     */
    public static uploadAvatar(){
        return multer({storage:avatarStorage})
    }

     /**
     * Guarda un documento en la carpteta /views/docs
     */
    public static uploadDocument(){
        return multer({storage:documentStorage})
    }
    
  
}