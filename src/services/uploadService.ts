import Boom from "@hapi/boom";
import { UploadDataDto } from "../dto/uploadDto";
import { checkBucket } from "./bucketService";
import { resizeImage } from "../common/resizeImage";
import {
  getFile,
  putFile,
  delFile,
  getAllFile,
  delFileAll,
} from "../common/actionFile";

type RESIZE_OF = "w" | "h";

export const getFiles = async ({
  bucketName,
  fileNameNtype,
}: {
  bucketName: string;
  fileNameNtype: string;
}): Promise<any> => {
  if (!bucketName) {
    throw Boom.badRequest("Require bucketname in x header");
  }
  // bucketName = "cmsi";
  const bucketIsExist = await checkBucket(bucketName);
  if (!bucketIsExist) {
    throw Boom.forbidden("no bucket");
  }
  try {
    const fileName = fileNameNtype.split(".");
    const filePath = fileName[0].split("_");
    const newFileNameNFolder = `${filePath[0]}/${fileNameNtype}`;
    return getFile(bucketName, newFileNameNFolder, fileName[1]);
  } catch (error: any) {
    throw Boom.boomify(error);
  }
};

export const getAllFiles = async ({
  bucketName,
  fileNameNtype,
}: {
  bucketName: string;
  fileNameNtype: string;
}): Promise<any> => {
  if (!bucketName) {
    throw Boom.badRequest("Require bucketname in x header");
  }
  const bucketIsExist = await checkBucket(bucketName);
  if (!bucketIsExist) {
    throw Boom.forbidden("no bucket");
  }
  try {
    const fileName = fileNameNtype.split(".");
    const filePath = fileName[0].split("_");
    const allFiles: any = await getAllFile(bucketName, filePath[0]);
    const objectList: [] = allFiles["objectsList"];

    objectList.map((f: any) => {
      const file = f.name.split("/");
      f.path = file[0];
      f.name = file[1];
    });
    return objectList;
  } catch (error: any) {
    throw Boom.boomify(error);
  }
};

export const uploadFile = async ({
  bucketName,
  rawFiles,
  resizes,
  resizeOf = "w",
}: {
  bucketName: string;
  rawFiles: any;
  resizes: string;
  resizeOf?: RESIZE_OF;
}): Promise<{ data: UploadDataDto; meta: string }> => {
  try {
    if (!bucketName) {
      throw Boom.badRequest("Require bucketname in x header");
    }
    if (!rawFiles) {
      throw Boom.badRequest("file require");
    }
    const bucketIsExist = await checkBucket(bucketName);
    if (!bucketIsExist) {
      throw Boom.forbidden("no bucket");
    }
    const data: UploadDataDto = new UploadDataDto();
    const key = Object.keys(rawFiles)[0];
    const fileNameNType = rawFiles[key].name.split(".");
    const file = {
      name: Date.now().toString(),
      size: rawFiles[key].size,
      original: {
        name: fileNameNType[0],
        type: fileNameNType[1],
      },
    };
    // console.log(rawFiles[key]);
    const newFileName = `${file.name}.${file.original.type}`;
    const newFileNameNFolder = `${file.name}/${newFileName}`;

    /* Main File */
    const meta = await putFile(
      bucketName,
      newFileNameNFolder,
      rawFiles[key].data,
      rawFiles[key].size
    );

    /* Resize */
    const dataResize: Array<any> = [];
    if (resizes) {
      const resizeArr: Array<string> = resizes.split(",");
      for (let rs of resizeArr) {
        const width = resizeOf === "w" ? parseInt(rs) : 0;
        const height = resizeOf === "h" ? parseInt(rs) : 0;
        const resized = await resizeImage({
          width,
          height,
          rawData: rawFiles[key].data,
          file,
          bucketName,
          resizeOf,
        });
        dataResize.push({
          fileName: resized.fileName,
          msg: resized.msg,
        });
      }
      data.resize = dataResize;
    }

    data.isUpload = true;
    data.fileName = newFileName;
    data.fileSize = file.size;
    data.originalFileName = `${file.original.name}.${file.original.type}`;
    return {
      data,
      meta,
    };
  } catch (error: any) {
    throw Boom.boomify(error);
  }
};

export const removeFiles = async ({
  bucketName,
  fileNameNtype,
  delAll,
}: {
  bucketName: string;
  fileNameNtype: string;
  delAll: boolean;
}): Promise<any> => {
  if (!bucketName) {
    throw Boom.badRequest("Require bucketname in x header");
  }
  const bucketIsExist = await checkBucket(bucketName);
  if (!bucketIsExist) {
    throw Boom.forbidden("no bucket");
  }
  try {
    const fileName = fileNameNtype.split(".");
    const filePath = fileName[0].split("_");
    const newFileNameNFolder = `${filePath[0]}/${fileNameNtype}`;
    let deleted = "";
    if (delAll) {
      const files = await getAllFile(bucketName, filePath[0]);
      const objectsListToDelete: [] = files.objectsListToDelete;

      deleted = await delFileAll(bucketName, objectsListToDelete);
    } else {
      deleted = await delFile(bucketName, newFileNameNFolder);
    }

    return deleted;
  } catch (error: any) {
    throw Boom.boomify(error);
  }
};
