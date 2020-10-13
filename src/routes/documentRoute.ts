import { DocumentController } from '../controllers/documentController';

/**
 * exampleRoute
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */

/**
 * Carga el controlador
 */
const documentController = new DocumentController();

/**
 * Habilita el Router
 */
const DocumentRouter:any = documentController.router();

/**
 * index
 * 
 * Ruta por defecto
 * 
 * @route /example/
 * @method get
 */
DocumentRouter.get('/', documentController.index);
/**
 * Subir Documento
 * 

 * 
 * @route /v1/document/upload
 * @method post
 */
DocumentRouter.post('/upload', documentController.uploadDocument);

 /**
 * Descargar un documento
 * 
 * 
 * @route /v1/document/download/:name
 * @method get 
  */
DocumentRouter.get('/download/:name', documentController.dowloadDocument)

module.exports = DocumentRouter;
