import * as Minio from "minio";

const minioClient = new Minio.Client({
  // endPoint: "play.min.io",
  // port: 9000,
  // useSSL: true,
  // accessKey: "Q3AM3UQ867SPQQA43P2F",
  // secretKey: "zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG",
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(<string>process.env.MINIO_PORT, 10) || 9000,
  useSSL: false,
  // secure: true,
  // useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || "minio",
  secretKey: process.env.MINIO_SECRET_KEY || "minio123",
});

export default minioClient;
