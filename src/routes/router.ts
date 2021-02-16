import * as express from 'express';
const version = '/v1'

/**
 * Router
 * 
 * Maneja las rutas de la aplicación
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 */

export class Router
{
    /**
     * El router de express
     */
    protected route:any;

    /**
     * El constructor
     * 
     * @param {Express.express} app     La aplicacion express
     */
    public constructor(app:express.Express)
    {
        this.route = app;

        // Carga las rutas
        this.router();
    }

    /**
     * Rutas principales de la aplicación
     * 
     * Llama a los restantes enrutadores
     */
    public router():void
    {

        /**
         * Manejador de rutas de image
         *
         * @route /v1/image/...
         */
        this.route.use(version+'/image', require('./imagesRoutes'));
        /**
         * Manejador de rutas de avatar
         *
         * @route /v1/avatar/...
         */
        this.route.use(version+'/avatar', require('./avatarRoutes'));
        /**
         * Manejador de rutas de Document
         *
         * @route /v1/document/...
         */
        this.route.use(version+'/document', require('./documentRoute'));
        /**
         * Manejador de rutas de Audio
         *
         * @route /v1/audio/...
         */
        this.route.use(version+'/audio', require('./audioRoute'));
        /**
         * Manejador de rutas de Video
         *
         * @route /v1/video/...
         */
        this.route.use(version+'/video', require('./videoRoute'));

        /**
         * Manejador de rutas de Video
         *
         * @route /v1/background/...
         */
        this.route.use(version+'/background', require('./backgroundsRoute'));

    }
}
