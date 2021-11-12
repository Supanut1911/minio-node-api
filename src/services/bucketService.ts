import minioClient from "../minioClient";
import Boom from "@hapi/boom";
export const listAllBucket = async () => {
  try {
    const listbuckets = await minioClient.listBuckets();
    return listbuckets;
  } catch (error: any) {
    throw Boom.boomify(error);
  }
};

export const checkBucket = async (bucketName: string) => {
  try {
    return minioClient.bucketExists(bucketName);
  } catch (error: any) {
    throw Boom.boomify(error);
  }
};

export const createBucket = async (bucketName: string) => {
  try {
    const bucketIsExist = await checkBucket(bucketName);
    if (bucketIsExist) {
      return false;
    }
    await minioClient.makeBucket(bucketName, "us-east-1");
    console.log(`Bucket Name '${bucketName}' was created!`);
    return true;
  } catch (error: any) {
    throw Boom.boomify(error);
  }
};

export const deleteBucket = async (bucketName: string) => {
  try {
    if (!(await minioClient.bucketExists(bucketName))) {
      return false;
    }
    await minioClient.removeBucket(bucketName);
    console.log(`Bucket Name '${bucketName}' removed successfully.`);
    return true;
  } catch (error: any) {
    throw Boom.boomify(error);
  }
};
