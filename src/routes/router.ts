import * as express from 'express';

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
        this.route.use('/v1/image', require('./imagesRoutes'));
        /**
         * Manejador de rutas de avatar
         *
         * @route /v1/avatar/...
         */
        this.route.use('/v1/avatar', require('./avatarRoutes'));
        /**
         * Manejador de rutas de Document
         *
         * @route /v1/document/...
         */
        this.route.use('/v1/document', require('./documentRoute'));

    }
}
