export interface ICloudGateway {
  uploadImage(imageBase64: string): Promise<string>; //image in base64
  deleteImageWithUrl(url: string): Promise<void>;
}
