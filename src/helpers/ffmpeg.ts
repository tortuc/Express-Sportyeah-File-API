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

import Ffmpeg = require("fluent-ffmpeg");
import * as path from "path";
import * as fs from "fs";

const concat = require("ffmpeg-concat");
var command = Ffmpeg();
export class FFMPEG {
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
   * Guarda una imagen en la carpteta /uploads/images
   */
  public static async concatVideo(originalpath) {
    return new Promise((resolve, reject) => {
      const basename = this.baseName(originalpath);

      Ffmpeg(originalpath)
        .output(path.resolve(__dirname + `/../uploads/videos/${basename}r.mp4`))
        .size("360x640")
        .on("error", function(err) {
          reject(err);
        })

        .on("end", async function() {
          fs.unlinkSync(originalpath);

          await concat({
            output: path.resolve(
              __dirname + `/../uploads/videos/${basename}sportyeah.mp4`
            ),
            videos: [
              path.resolve(__dirname + `/../uploads/videos/${basename}r.mp4`),
              path.resolve(__dirname + "/../assets/ending-360.mp4"),
            ],
            transition: {
              name: "fade",
              duration: 100,
            },
          });
          resolve(`${basename}sportyeah.mp4`);
        })
        .run();
    });
  }

  public static resizeEnding() {
    Ffmpeg(path.resolve(__dirname + `/../assets/ending.mp4`))
      .output(path.resolve(__dirname + `/../assets/ending-360.mp4`))
      .size("360x640")
      .on("error", function(err) {
        console.log(err);
      })

      .on("end", async function() {
        console.log("siiiu");
      })
      .run();
  }

  private static baseName(str: string) {
    let last = str.split("\\").pop();

    var base = new String(last).substring(last.lastIndexOf("/") + 1);

    if (base.lastIndexOf(".") != -1) {
      base = base.substring(0, base.lastIndexOf("."));
    }
    return base;
  }
}
