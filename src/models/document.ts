import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Modelo de Documents
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
    name            : Type.string({required: true}),
    originalName    : Type.string({required: true}),
    deleted         : Type.boolean({default:false}),
    date            : Type.date({default: Date.now})
});

const Document = typedModel('Document', schema, undefined, undefined, 
    {
     
        /**
         *  Guarda un documento en la base de datos
         * @param name  Nombre generado por multer
         * @param originalName Nombre original del archivo
         */
        async new(name,originalName){
            let newDocument = new Document({name,originalName})
            return await newDocument.save()
        },
        async findByName(name){
            return await Document.findOne({name})
        }

       
        
    }
);

/**
 * Exporta el modelo
 */
export default Document;
