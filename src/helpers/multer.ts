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
 * Storage para avatars
 */

var avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname + "/../uploads/avatars"));
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
 * Storage para documentos
 */

var documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname + "/../uploads/documents"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

/**
 * Storage para Audios
 */

var audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname + "/../uploads/audios"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".mp3");
  },
});

var videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname + "/../uploads/videos"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

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
   * Guarda un avatar en la carpteta /uploads/avatars
   */
  public static uploadAvatar() {
    return multer({ storage: avatarStorage });
  }

  /**
   * Guarda un documento en la carpteta /uploads/documents
   */
  public static uploadDocument() {
    return multer({ storage: documentStorage });
  }

  /**
   * Guarda un documento en la carpteta /uploads/documents
   */
  public static uploadBackground() {
    return multer({ storage: backgroundStorage });
  }

  /**
   * Guarda un audio en la carpteta /uploads/audios
   */
  public static uploadAudio() {
    return multer({ storage: audioStorage });
  }
  /**
   * Guarda un video en la carpteta /uploads/videoss
   */
  public static uploadVideo() {
    return multer({ storage: videoStorage });
  }
}
