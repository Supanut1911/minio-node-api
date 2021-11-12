import { imageTypes, documentTypes } from "./../constant";

export function replyType(_fileType: string) {
  const fileType = _fileType.toLowerCase();

  if (imageTypes.includes(fileType)) {
    return `image/${fileType}`;
  } else if (documentTypes.includes(fileType)) {
    return `application/${fileType}`;
  } else {
    return false;
  }
}
