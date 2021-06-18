import { createSchema, Type, typedModel } from "ts-mongoose";

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
  url: Type.string({ required: true }),
  date: Type.date({ default: Date.now }),
  size: Type.number({ default: 0 }),
});

const Image = typedModel("Image", schema, undefined, undefined, {
  async findAll() {
    return await Image.find().sort({ date: -1 });
  },
  async new(url, size) {
    let newImage = new Image({ url, size });
    return await newImage.save();
  },
  totalImages() {
    return Image.countDocuments();
  },
  totalSizeImages() {
    return Image.aggregate([
      {
        $group: {
          _id: null,
          totalSize: { $sum: "$size" },
        },
      },
    ]);
  },
});

/**
 * Exporta el modelo
 */
export default Image;
