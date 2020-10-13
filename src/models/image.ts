import { createSchema, Type, typedModel } from 'ts-mongoose';

/**
 * Modelo de Images
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
    date    : Type.date({default: Date.now})
});

const Image = typedModel('Image', schema, undefined, undefined, 
    {
       
        async findAll(){
            return await Image.find().sort({date:-1})
            },
        async new(url){
            let newImage = new Image({url})
            return await newImage.save()
        }

        
    }
);

/**
 * Exporta el modelo
 */
export default Image;
