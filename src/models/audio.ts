import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Modelo de Audio
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
    duration    : Type.number(),
    date        : Type.date({default: Date.now})
});

const Audio = typedModel('Audio', schema, undefined, undefined, 
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
         * Guarda el registro de un audio
         * @param audio 
         */
        saveAudio(audio){
            return new Audio(audio).save()
        }

    }
);

/**
 * Exporta el modelo
 */
export default Audio;
