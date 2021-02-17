import { VideoController } from '../controllers/videoController';

/**
 *  videoRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */

/**
 * Carga el controlador
 */
const videoController = new VideoController();

/**
 * Habilita el Router
 */
const VideoRouter:any = videoController.router();



/**
 * subir video, hay que pasarle un form data con el nombre `video`
 * @route /v1/video/upload
 * @method post
 */

VideoRouter.post('/uploadFromUrl',videoController.uploadVideoFromUrl)

/**
 * subir video, hay que pasarle un form data con el nombre `video`
 * @route /v1/video/upload
 * @method post
 */

VideoRouter.post('/upload',videoController.upload)

 /**
 * Obtener un video
 * 
 * 
 * @route /v1/video/get/:video
 * @method get 
  */
 VideoRouter.get('/get/:video', videoController.getVideo)

module.exports = VideoRouter;
