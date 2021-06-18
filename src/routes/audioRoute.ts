import { AudioController } from '../controllers/audioController';

/**
 * audioRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */

/**
 * Carga el controlador
 */
const audioController = new AudioController();

/**
 * Habilita el Router
 */
const AudioRouter:any = audioController.router();



/**
 * Subi un audio, hay que pasarle un form data con el nombre `audio`
 * @route /v1/audio/upload
 * @method post
 */

AudioRouter.post('/upload',audioController.upload)

 /**
 * Obtener un audio
 * 
 * 
 * @route /v1/audio/get/:audio
 * @method get 
  */
 AudioRouter.get('/get/:audio', audioController.getAudio)

module.exports = AudioRouter;
