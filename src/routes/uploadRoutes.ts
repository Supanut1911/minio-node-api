import { RouteOptions } from "fastify";

import uploadController from "../controller/uploadController";
import bucketController from "../controller/bucketController";
export const routes: RouteOptions[] = [
  {
    method: "POST",
    url: "/file",
    handler: uploadController.uploadFile,
  },
  {
    method: "GET",
    url: "/file/:fileName",
    handler: uploadController.getFiles,
  },
  {
    method: "DELETE",
    url: "/file/:fileName",
    handler: uploadController.removeFile,
  },
  {
    method: "GET",
    url: "/file/:fileName/list",
    handler: uploadController.getAllFiles,
  },
  {
    method: "GET",
    url: "/buckets",
    handler: bucketController.listAllBucket,
  },
  {
    method: "GET",
    url: "/bucket/:bucketName",
    handler: bucketController.checkBucket,
  },
  {
    method: "DELETE",
    url: "/bucket",
    handler: bucketController.deleteBucket,
  },
  {
    method: "POST",
    url: "/bucket",
    handler: bucketController.createBucket,
  },
  {
    method: "GET",
    url: "/healthcheck",
    handler: uploadController.healthcheck,
  },
];
