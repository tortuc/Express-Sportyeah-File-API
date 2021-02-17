import { EventBackgroundController } from "../controllers/eventBackgroundsController";
/**
 * exampleRoute
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */

/**
 * Carga el controlador
 */
const eventBackgroundsController = new EventBackgroundController();

/**
 * Habilita el Router
 */
const EventBackgroundRoute: any = eventBackgroundsController.router();

/**
 * index
 *
 * Ruta por defecto
 *
 * @route /example/
 * @method get
 */
EventBackgroundRoute.get("/", eventBackgroundsController.index);
/**
 * Subir imagen
 * 

 * 
 * @route /v1/background/upload/:app/:type
 * @method post
 */
EventBackgroundRoute.post("/upload/:app/:type", eventBackgroundsController.uploadBackground);

/**
 * Obtener un background
 *
 *
 * @route /v1/background/get/:background
 * @method get
 */
EventBackgroundRoute.get("/get/:background", eventBackgroundsController.getbackground);

/**
 * Obtener todos los backgrounds de un evento
 *
 *
 * @route /v1/background/all
 * @method get
 */
EventBackgroundRoute.get("/all/:app/:type", eventBackgroundsController.getbackgrounds);

/**
 * Elimina un background
 *
 *
 * @route /v1/background/:id
 * @method delete
 */
EventBackgroundRoute.delete("/:id", eventBackgroundsController.deleteBackground);

module.exports = EventBackgroundRoute;
