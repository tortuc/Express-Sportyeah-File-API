import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Modelo de Video
 * 
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 * 
 * @link https://www.npmjs.com/package/ts-mongoose
 */

/**
 * Define el esquema del modelo
 */
const schema = createSchema({
    name        : Type.string(),
    size        : Type.number(),
    date        : Type.date({default: Date.now})
});

const Video = typedModel('Video', schema, undefined, undefined, 
    {
        /**
         * Obtiene el primer test con un nombre dado
         * 
         * @param {string} name     El nombre
         */
        findOneByName: function (name: string) {
            return this.findOne({ name : name });
        },
        /**
         * Guarda el registro de un video
         * @param video 
         */
        saveVideo(video){
            return new Video(video).save()
        }

    }
);

/**
 * Exporta el modelo
 */
export default Video;
