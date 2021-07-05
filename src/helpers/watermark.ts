import * as multer from "multer";
import * as path from "path";
import * as fs from 'fs'

const fluentffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
fluentffmpeg.setFfmpegPath(ffmpegPath);
var Jimp = require('jimp');
//const exec = require("child_process").execSync;
const { spawn, exec } = require('child_process')
export class Watermark {


    /**
     * El constructor es privado
     */
    public constructor() {
        // Constructor Privado

    }



    public async createVideoWatermark(VIDEO, USER) {

        const VIDEO_PATH = path.resolve(__dirname + '/../uploads/videos/') + "/" + VIDEO;
        const WATERMARK_PATH = path.resolve(__dirname + '/../assets/') + '/imagotipo_negro.png';
        const data = [
            {
                "value": USER,
                "placement": "bottom"
            }
        ];

        const NAMELOGO = Date.now();

        await this.createImage(data, WATERMARK_PATH, NAMELOGO);

        await this.createImageSplash(data, NAMELOGO);

        //this.reziseVideo(VIDEO);

        await fluentffmpeg()
            .input(path.resolve(__dirname + '/../assets/') + "/" + NAMELOGO + "_splash.jpg")
            .size('640x480').autopad()
            .loop(3.5)
            .noAudio()
            .output(path.resolve(__dirname + "/../uploads/videos/") + "/" + NAMELOGO + "_splash.mp4")
            .on('end', function (stdout, stderr) {

            })
            .run();
        console.log('VIDEO_PATH =>', VIDEO_PATH)

        await fluentffmpeg()
            .input(VIDEO_PATH)
            .input(path.resolve(__dirname + '/../assets/') + `/${NAMELOGO}_watermark.png`)
            .output(path.resolve(__dirname + "/../uploads/videos/") + "/" + VIDEO + "-watermark.mp4")
            .videoCodec('libx264')
            .complexFilter([
                "[1][0]scale2ref=w='iw*15/100':h='ow/mdar'[wm][vid];[vid][wm]overlay=x='if(lt(mod(t,10),5),W-w-10,10)':y='if(lt(mod(t,10),5),10,H-h-10)'"
            ])

            .on('end', function (stdout, stderr) {

                fs.unlinkSync(path.resolve(__dirname + '/../assets/') + `/${NAMELOGO}_watermark.png`);
                console.log('Transcoding succeeded !');
                console.log(path.resolve(__dirname + "/../uploads/videos/") + "/" + VIDEO + "-watermark.mp4");
                console.log(path.resolve(__dirname + "/../uploads/videos/") + "/" + NAMELOGO + "_splash.mp4");
                const videoWatermark = path.resolve(__dirname + "/../uploads/videos/") + '/' + VIDEO + '-watermark.mp4'
                const videosplash = path.resolve(__dirname + "/../uploads/videos/") + '/' + NAMELOGO + '_splash.mp4'
                const videospath = path.resolve(__dirname + "/../uploads/videos/")

                var command = fluentffmpeg(videoWatermark)
                    .addOptions([
                        '-c copy',
                        '-bsf:v',
                        'h264_mp4toannexb',
                        '-f mpegts'
                    ])
                    .output(path.resolve(__dirname + "/../uploads/videos/") + "/" + VIDEO + ".mp43");

                command.run();

                var command2 = fluentffmpeg(videosplash)
                    .addOptions([
                        '-c copy',
                        '-bsf:v',
                        'h264_mp4toannexb',
                        '-f mpegts'
                    ])
                    .output(path.resolve(__dirname + "/../uploads/videos/") + "/" + NAMELOGO + ".mp43");

                command2.run();

                console.log('ffmpeg -i "concat:' + videospath + '/' + VIDEO + '.ts|' + videospath + '/' + NAMELOGO + '.ts" -c copy -bsf:a aac_adtstoasc ' + videospath + '/' + VIDEO + 'output.mp4')
                //exec('ffmpeg -i "concat:' + videospath + '/' + VIDEO + '.mp43|' + videospath + '/' + NAMELOGO + '.mp43" -c copy -bsf:a aac_adtstoasc ' + videospath + '/' + VIDEO + '_finish.mp4')
                fs.unlinkSync(path.resolve(__dirname + '/../uploads/videos/') + `/${VIDEO}`);
                exec('ffmpeg -i "concat:' + videospath + '/' + VIDEO + '.mp43|' + videospath + '/' + NAMELOGO + '.mp43" -c copy -bsf:a aac_adtstoasc ' + videospath + '/' + VIDEO+'.mp4' , (err, stdout, stderr) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                    fs.unlinkSync(path.resolve(__dirname + '/../uploads/videos/') + `/${NAMELOGO}.mp43`);
                    fs.unlinkSync(path.resolve(__dirname + '/../uploads/videos/') + `/${VIDEO}.mp43`);
                    fs.unlinkSync(path.resolve(__dirname + '/../uploads/videos/') + `/${VIDEO}-watermark.mp4`);
                    fs.unlinkSync(path.resolve(__dirname + '/../uploads/videos/') + `/${NAMELOGO}_splash.mp4`);

                  });



            })
            .run();








    }

    public createImage(textArray, qrcode, NAMELOGO) {
        return new Promise((resolve, reject) => {
            Jimp.loadFont(Jimp.FONT_SANS_128_BLACK).then(font => {
                Jimp.read(qrcode)
                    .then(image => {
                        const width = image.bitmap.width
                        const height = image.bitmap.height

                        for (const { value, placement } of textArray) {
                            const textWidth = Jimp.measureText(font, value)
                            const textHeight = Jimp.measureTextHeight(font, value)

                            const start = (width / 2) - (textWidth / 2)

                            const textImage = new Jimp(textWidth, textHeight, 0x0, (err, image) => {
                                if (err) throw err;
                            })

                            switch (placement) {
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
                        return image.writeAsync(path.resolve(__dirname + '/../assets/') + `/${NAMELOGO}_watermark.png`);
                        //return image.quality(90).getBase64Async(Jimp.MIME_PNG)
                    })
                    .then(resolve)
                    .catch(reject)
            })
        })
    }

    public reziseVideo(video) {

        return new Promise((resolve, reject) => {

            fluentffmpeg()
                .input(path.resolve(__dirname + "/../uploads/videos/") + "/" + video)
                .seekInput(10)
                .videoCodec('libx264')
                .toFormat('mp4')
                .size('640x480').autopad()
                .output(path.resolve(__dirname + "/../uploads/videos/") + "/" + video + "-rezise.mp4")
                .run();

        })

    }

    public createImageSplash(textArray, NAMELOGO) {

        const img = path.resolve(__dirname + '/../assets/') + "/splash-screens.jpg"
        return new Promise((resolve, reject) => {
            Jimp.loadFont(Jimp.FONT_SANS_128_BLACK).then(font => {
                Jimp.read(img)
                    .then(image => {
                        const width = image.bitmap.width
                        const height = image.bitmap.height

                        for (const { value, placement } of textArray) {
                            const textWidth = Jimp.measureText(font, value)
                            const textHeight = Jimp.measureTextHeight(font, value)

                            const start = (width / 2) - (textWidth / 2)

                            const textImage = new Jimp(textWidth, textHeight, 0x0, (err, image) => {
                                if (err) throw err;
                            })

                            switch (placement) {
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
                        return image.writeAsync(path.resolve(__dirname + '/../assets/') + `/${NAMELOGO}_splash.jpg`);
                        //return image.quality(90).getBase64Async(Jimp.MIME_PNG)
                    })
                    .then(resolve)
                    .catch(reject)
            })
        })
    }





}
