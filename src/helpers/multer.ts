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

/**
 * Storage para imagenes
 */

var imageStorage = multer.diskStorage({
    destination :   (req, file, cb) => {
      cb(null, path.resolve(__dirname + '/../uploads/images'))
    },
    filename    :   (req, file, cb) => {
      cb(null, Date.now() +  path.extname(file.originalname))
    }
  })
  
  /**
   * Storage para avatars
   */

var avatarStorage = multer.diskStorage({
    destination :   (req, file, cb) => {
      cb(null, path.resolve(__dirname + '/../uploads/avatars'))
    },
    filename    :   (req, file, cb) => {
      cb(null, Date.now() +  path.extname(file.originalname))
    }
  })

  /**
   * Storage para documentos
   */

  var documentStorage = multer.diskStorage({
    destination :   (req, file, cb) => {
      cb(null, path.resolve(__dirname + '/../uploads/documents'))
    },
    filename    :   (req, file, cb) => {
      cb(null, Date.now() +  path.extname(file.originalname))
    }
  })
   
  
  /**
   * Storage para Audios
   */

  var audioStorage = multer.diskStorage({
    destination :   (req, file, cb) => {
      cb(null, path.resolve(__dirname + '/../uploads/audios'))
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
     * Guarda una imagen en la carpteta /uploads/images
     */
    public static uploadImage(){
        return multer({storage:imageStorage})
    }

      /**
     * Guarda un avatar en la carpteta /uploads/avatars
     */
    public static uploadAvatar(){
        return multer({storage:avatarStorage})
    }

     /**
     * Guarda un documento en la carpteta /uploads/documents
     */
    public static uploadDocument(){
        return multer({storage:documentStorage})
    }
    
     /**
     * Guarda un auidio en la carpteta /uploads/audios
     */
    public static uploadAudio(){
        return multer({storage:audioStorage})
    }
    
  
}