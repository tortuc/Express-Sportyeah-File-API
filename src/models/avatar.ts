import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Modelo de Avatars
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
    url    : Type.string({required: true}),
    deleted : Type.boolean({default:false}),
    date    : Type.date({default: Date.now})
});

const Avatar = typedModel('Avatar', schema, undefined, undefined, 
    {
     
        /**
         * 
         * Obtiene todos los avatares que no esten eliminados
         */
        async findAll(){
            return await Avatar.find({deleted:false}).sort({date:-1})
            },
        /**
         * Registra un avatar en la DB
         * @param url Url del avatar cargado
         */
        async new(url){
            let newAvatar = new Avatar({url})
            return await newAvatar.save()
        },
        /**
         * Elimina un avatar de los registro de la base de datos
         * @param {Types.ObjectId} id id del avatar
         */
        async delete(id){
            return Avatar.findByIdAndUpdate(id,{deleted:true},{new:true})
        }

        
    }
);

/**
 * Exporta el modelo
 */
export default Avatar;
