import { ImageController } from '../controllers/imagesController';

/**
 * exampleRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */

/**
 * Carga el controlador
 */
const imageController = new ImageController();

/**
 * Habilita el Router
 */
const ImagesRouter:any = imageController.router();

/**
 * index
 * 
 * Ruta por defecto
 * 
 * @route /example/
 * @method get
 */
ImagesRouter.get('/', imageController.index);
/**
 * Subir imagen
 * 

 * 
 * @route /v1/image/upload
 * @method post
 */
ImagesRouter.post('/upload', imageController.uploadImage);

/**
 * Subir imagen desde url
 * 
 * 
 * @route /v1/image/upload
 * @method post
 */
ImagesRouter.post('/uploadFromUrl', imageController.uploadImageFromUrl);

 /**
 * Obtener una imagen
 * 
 * 
 * @route /v1/image/get/:image
 * @method get 
  */
ImagesRouter.get('/get/:image', imageController.getImage)

module.exports = ImagesRouter;
