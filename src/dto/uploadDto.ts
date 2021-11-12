export class UploadDataDto {
  isUpload: boolean = false;
  fileName: string = "";
  originalFileName: string = "";
  fileNameResize?: string;
  fileSize: string = "";
  resize?: any;
  fileType?: string;
  msg?: string;
}

export class ResizeImageDto {
  width: number = 320;
  height: number = 320;
  rawData: any;
  file: any;
}

export class ResizeImageReturnDto {
  upload: boolean = false;
  fileName: string = "";
  msg?: string = "";
}
