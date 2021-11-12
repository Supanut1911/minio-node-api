import Boom from "@hapi/boom";
import * as service from "../services/bucketService";

const listAllBucket = async () => {
  return service.listAllBucket();
};

const checkBucket = async (request: any, reply: any) => {
  const bucketName = <string>request.params?.bucketName;
  return service.checkBucket(bucketName);
};

const createBucket = async (request: any, reply: any) => {
  const bucketName = request.body?.bucketName;
  const createdBucket = await service.createBucket(bucketName);
  if (!createdBucket) {
    throw Boom.conflict(`Bucket Name '${bucketName}' already exist!`);
  } else {
    return {
      message: `Bucket Name '${bucketName}'' was created!`,
    };
  }
};

const deleteBucket = async (request: any, reply: any) => {
  const bucketName = request.body?.bucketName;
  const deletedBucket = await service.deleteBucket(bucketName);
  if (!deletedBucket) {
    throw Boom.badRequest(`Bucket Name '${bucketName}' not already exist!`);
  } else {
    return {
      message: `Bucket Name '${bucketName}' removed successfully.`,
    };
  }
};

export default {
  listAllBucket,
  checkBucket,
  createBucket,
  deleteBucket,
};
