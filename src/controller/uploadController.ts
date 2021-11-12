import crypto from "crypto";
import { addDays, pickUp } from "../common/fn";
import bucketController from "./bucketController";
import * as service from "../services/uploadService";

const uploadFile = async (request: any, reply: any) => {
  const bucketName = request.headers["x-app-bucket"];
  const rawFiles = request.raw?.files;
  const resizes = request.body?.resize || null;
  const resizeOf = request.body?.resizeOf;
  const uploaded = await service.uploadFile({
    bucketName,
    rawFiles,
    resizes,
    resizeOf,
  });
  return uploaded.data;
};

const getFiles = async (request: any, reply: any) => {
  const bucketName = request.headers["x-app-bucket"];
  const fileNameNtype = request.params.fileName;
  const file = await service.getFiles({
    bucketName,
    fileNameNtype,
  });
  return reply
    .type(file.type)
    .etag(crypto.createHash("md5").update(fileNameNtype).digest("hex"))
    .expires(addDays(new Date(), 7))
    .send(file.dataStream);
};

const getAllFiles = async (request: any, reply: any) => {
  const bucketName = request.headers["x-app-bucket"];
  const fileNameNtype = request.params.fileName;
  const files = await service.getAllFiles({
    bucketName,
    fileNameNtype,
  });
  return pickUp(files, ["name"]);
};

const removeFile = async (request: any, reply: any) => {
  const bucketName = request.headers["x-app-bucket"];
  const fileNameNtype = request.params.fileName;
  const delAll = request.query?.all ? true : false;

  const removed = await service.removeFiles({
    bucketName,
    fileNameNtype,
    delAll,
  });
  if (removed.status) {
    return reply.status(200).send({
      message: `Removed ${removed.item} item successful`,
    });
  }
};

const healthcheck = async (request: any, reply: any) => {
  try {
    await bucketController.listAllBucket();
    reply
      .send({
        status: "connected",
      })
      .status(200);
  } catch (error: any) {
    reply
      .send({
        status: "not connected",
        error,
      })
      .status(500);
  }
};

export default {
  healthcheck,
  uploadFile,
  getFiles,
  getAllFiles,
  removeFile,
};
