import { AvatarController } from '../controllers/avatarController';

/**
 * exampleRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */

/**
 * Carga el controlador
 */
const avatarController = new AvatarController();

/**
 * Habilita el Router
 */
const AvatarRoutes:any = avatarController.router();

/**
 * index
 * 
 * Ruta por defecto
 * 
 * @route /example/
 * @method get
 */
AvatarRoutes.get('/', avatarController.index);
/**
 * Subir imagen
 * 

 * 
 * @route /v1/avatar/upload
 * @method post
 */
AvatarRoutes.post('/upload', avatarController.uploadAvatar);

 /**
 * Obtener un avatar
 * 
 * 
 * @route /v1/avatar/get/:avatar
 * @method get 
  */
AvatarRoutes.get('/get/:avatar', avatarController.getAvatar)

 /**
 * Obtener todos los Avatars
 * 
 * 
 * @route /v1/avatar/all
 * @method get 
  */
 AvatarRoutes.get('/all', avatarController.getAvatars)

 /**
 * Elimina un avatar
 * 
 * 
 * @route /v1/avatar/:id
 * @method delete 
  */
 AvatarRoutes.delete('/:id', avatarController.deleteAvatar)

module.exports = AvatarRoutes;
