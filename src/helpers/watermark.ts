import * as multer from "multer";
import * as path from "path";
import * as fs from 'fs'

const fluentffmpeg = require('fluent-ffmpeg');
var Jimp = require('jimp');

export class Watermark {


  /**
   * El constructor es privado
   */
   public constructor() {
    // Constructor Privado
    
  }



  public async createVideoWatermark(VIDEO,USER) {
   
    const VIDEO_PATH = path.resolve(__dirname + '/../uploads/videos/')+"/"+VIDEO;
    const WATERMARK_PATH = path.resolve(__dirname + '/../assets/')+'/imagotipo_negro.png';

    const data = [
      {
          "value": USER,
          "placement": "bottom"
      }
  ];

    const NAMELOGO = Date.now();

    this.createImage(data,WATERMARK_PATH,NAMELOGO);

    fluentffmpeg()
    .input(VIDEO_PATH)
     .input(path.resolve(__dirname + '/../assets/')+`/${NAMELOGO}_watermark.png`)
     .output(path.resolve(__dirname + "/../uploads/videos/")+"/"+VIDEO+"-watermark.mp4")
     .complexFilter([
          "[1][0]scale2ref=w='iw*10/100':h='ow/mdar'[wm][vid];[vid][wm]overlay=x='if(lt(mod(t,10),5),W-w-10,10)':y='if(lt(mod(t,10),5),10,H-h-10)'"
     ])
     .on('end', function(stdout, stderr) {

        fs.unlinkSync(path.resolve(__dirname + '/../assets/')+`/${NAMELOGO}_watermark.png`);
        console.log('Transcoding succeeded !');

    })
     .run()


     



}

public createImage(textArray, qrcode,NAMELOGO) {
  return new Promise((resolve, reject) => {
      Jimp.loadFont(Jimp.FONT_SANS_128_BLACK).then(font => {
          Jimp.read(qrcode)
          .then(image => {
              const width = image.bitmap.width
              const height = image.bitmap.height

              for(const { value, placement } of textArray) {
                  const textWidth = Jimp.measureText(font, value)
                  const textHeight = Jimp.measureTextHeight(font, value)

                  const start = (width / 2) - (textWidth / 2)

                  const textImage = new Jimp(textWidth, textHeight, 0x0, (err, image) => {
                      if(err) throw err;
                  })
                  
                  switch(placement) {
                      case 'left':
                          textImage.print(font, 0, 0, value, width).rotate(90)
                          image.composite(textImage, 2, start)
                      break;
                      case 'top':
                          textImage.print(font, 0, 0, value, width)
                          image.composite(textImage, start, 2)
                      break;
                      case 'right':
                          textImage.print(font, 0, 0, value, width).rotate(90)
                          image.composite(textImage, width - 20, start)
                      break;
                      case 'bottom':
                          textImage.print(font, 0, 0, value, width)
                          image.composite(textImage, start, height - 170)
                      break;
                  }
              }
              return image.writeAsync(path.resolve(__dirname + '/../assets/')+`/${NAMELOGO}_watermark.png`);
              //return image.quality(90).getBase64Async(Jimp.MIME_PNG)
          })
          .then(resolve)
          .catch(reject)
      })
  })
}





}
