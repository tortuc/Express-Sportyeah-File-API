import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Modelo de EventBackground
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
    date    : Type.date({default: Date.now}),
    appName  : Type.string({required:true,default:'kecuki'}),
    typeEvent : Type.string({required:true})
});

const EventBackground = typedModel('EventBackground', schema, undefined, undefined, 
    {
     
        /**
         * 
         * Obtiene todos los EventBackgroundes que no esten eliminados
         */
        async findAllByType(app,type){
            return await EventBackground.find({appName:app,typeEvent:type,deleted:false}).sort({date:-1})
            },
        /**
         * Registra un EventBackground en la DB
         */
        async new(background){
            let newEventBackground = new EventBackground(background)
            return await newEventBackground.save()
        },
        /**
         * Elimina un EventBackground de los registro de la base de datos
         * @param {Types.ObjectId} id id del EventBackground
         */
        async delete(id){
            return EventBackground.findByIdAndUpdate(id,{deleted:true})
        }

        
    }
);

/**
 * Exporta el modelo
 */
export default EventBackground;
