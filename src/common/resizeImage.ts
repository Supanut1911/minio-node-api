import sharp = require("sharp");
import { imageSize } from "image-size";
import minioClient from "./../minioClient";
import { ResizeImageReturnDto } from "../dto/uploadDto";
import { imageTypes } from "../constant/imageTypes";

export function resizeImageUpstream(file: any, size: any): Promise<any> {
  return new Promise((resolve, reject) => {
    sharp(file)
      .resize(size)
      .toBuffer()
      .then((data) => {
        resolve(data);
      });
  });
}

export function resizeImage({
  width,
  height,
  rawData,
  file,
  bucketName,
  resizeOf,
}: {
  width: number;
  height: number;
  rawData: any;
  file: any;
  bucketName: string;
  resizeOf: string;
}): Promise<ResizeImageReturnDto> {
  let msg: string = "";
  return new Promise((resolve, reject) => {
    /* This is resize from img only */
    /* param ?resize=true&w=&h= (w&h df=320) */
    if (width === 0 && height === 0) {
      resolve({
        upload: false,
        fileName: "",
        msg: "(1) Can not resize this image becuase width and height of image = 0 (2) Please set width or height to resize",
      });
    }

    if (imageTypes.includes(file.original.type.toLowerCase())) {
      const originalImageSize = imageSize(rawData);
      const originalImageSizeHeight = originalImageSize.height || 100;
      const originalImageSizeWidth = originalImageSize.width || 100;

      if (width && originalImageSizeWidth <= width) {
        width = originalImageSizeWidth;
        msg = "original file width less than the size of you want.";
      }
      if (height && originalImageSizeHeight <= height) {
        height = originalImageSizeHeight;
        msg = "original file height less than the size of you want.";
      }

      if (!height) {
        height = Math.ceil(
          (width * originalImageSizeHeight) / originalImageSizeWidth
        );
      }
      if (!width) {
        width = Math.ceil(
          (height * originalImageSizeWidth) / originalImageSizeHeight
        );
      }

      let cFilename = "";
      if (resizeOf === "w") {
        cFilename = `_w${width}`;
      } else if (resizeOf === "h") {
        cFilename = `_h${height}`;
      }
      sharp.cache({ files: 0 });
      sharp.cache(false);
      sharp(rawData)
        .resize(width, height)
        .webp({ quality: 100 })
        .sharpen()
        .withMetadata()
        .toBuffer()
        .then((data) => {
          const newFileName = file.name + `${cFilename}.` + file.original.type;
          const newFileNameNFolder = `${file.name}/${newFileName}`;
          minioClient.putObject(
            bucketName,
            newFileNameNFolder,
            data,
            function (error) {
              if (error) {
                reject(error);
              }

              resolve({
                upload: true,
                fileName: newFileName,
                msg,
              });
            }
          );
        });
    } else {
      resolve({
        upload: false,
        fileName: "",
        msg: "Your file type is not resize",
      });
    }
  });
}
