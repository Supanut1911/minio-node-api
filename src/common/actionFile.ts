import { BucketItem } from "minio";
import minioClient from "../minioClient";
import { replyType } from "./replyType";

export async function putFile(
  bucketName: string,
  fileName: string,
  rawFile: any,
  size: number
): Promise<any> {
  return new Promise((resolve, reject) => {
    minioClient.putObject(
      bucketName,
      fileName,
      rawFile,
      size,
      (error, meta) => {
        if (error) {
          reject(error);
        }
        resolve(meta);
      }
    );
  });
}

export async function getFile(
  bucketName: string,
  fileNameNType: string,
  fileType: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    minioClient.getObject(bucketName, fileNameNType, (error, dataStream) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve({
        dataStream,
        type: replyType(fileType),
      });
    });
  });
}

export async function getAllFile(
  bucketName: string,
  filePath: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const objectsList: BucketItem[] = [];
    const objectsListToDelete: BucketItem[] = [];
    const objectsStream = minioClient.listObjects(bucketName, filePath, true);
    objectsStream.on("data", (obj: any) => {
      objectsList.push(obj);
      objectsListToDelete.push(obj.name);
    });

    objectsStream.on("error", function (e) {
      reject(e);
    });

    objectsStream.on("end", () => {
      resolve({
        objectsList,
        objectsListToDelete,
      });
    });
  });
}

export async function delFile(
  bucketName: string,
  fileNameNType: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    minioClient.removeObject(bucketName, fileNameNType, (error) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve({
        status: true,
        item: 1,
      });
    });
  });
}

export async function delFileAll(
  bucketName: string,
  objectsListToDelete: []
): Promise<any> {
  return new Promise((resolve, reject) => {
    minioClient.removeObjects(bucketName, objectsListToDelete, (error) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve({
        status: true,
        item: objectsListToDelete.length,
      });
    });
  });
}
