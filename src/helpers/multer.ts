/**
 * Clase Crypto
 *
 * Fachada con funciones de encriptación
 *
 * @author Jogeiker L <jogeiker1999@gmail.com>
 * @copyright JDV
 *
 * @link https://www.npmjs.com/package/bcrypt
 */

import * as multer from "multer";

import * as path from "path";

/**
 * Storage para imagenes
 */

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname + "/../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});

/**
  /**
   * Storage para los backgrounds de los eventos
   */

var backgroundStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname + "/../uploads/backgrounds"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});

/**
 * Storage para Audios
 */

export class Multer {
  /**
   * El constructor es privado
   */
  private constructor() {
    // Constructor Privado
  }

  /**
   * Crea un storage para las imagenes
   */

  /**
   * Guarda una un archivo, cualquiera en la carpeta temporal /uploads
   */
  public static uploadAny() {
    return multer({ storage: storage });
  }
  /**
 



  

  /**
   * Guarda un documento en la carpteta /uploads/documents
   */
  public static uploadBackground() {
    return multer({ storage: backgroundStorage });
  }
}
