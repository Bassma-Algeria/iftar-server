import { v2 as cloudinary } from "cloudinary";

import { ICloudGateway } from "../../../Ports/DrivenPorts/CloudGateway/CloudGateway.interface";

class CloudinaryCloudGateway implements ICloudGateway {
  constructor() {
    if (!process.env.CLOUDINARY_URL) this.MissingConfigsException();
  }

  async uploadImage(imageBase64: string): Promise<string> {
    try {
      const image = this.formatBase64ImageDataIntoUploadableString(imageBase64);

      const { secure_url } = await cloudinary.uploader.upload(image, { recource_type: "image" });
      return secure_url;
    } catch (error) {
      throw new Error(`Cloudinary: ${error}`);
    }
  }

  async deleteImageWithUrl(url: string): Promise<void> {
    try {
      const imageId: string = this.getPublicIdFromUrl(url);

      await cloudinary.uploader.destroy(imageId, { resource_type: "image" });
    } catch (error) {
      throw new Error(`Cloudinary: ${error}`);
    }
  }

  private formatBase64ImageDataIntoUploadableString(base64: string) {
    return `data:image/png;base64,${base64}`;
  }

  private getPublicIdFromUrl(url: string): string {
    const imageIdWithExtension = url.split("/")[url.split("/").length - 1];

    return imageIdWithExtension.split(".")[0];
  }

  private MissingConfigsException(): never {
    throw new Error("should have the cloudinary url in the envirement");
  }
}

export { CloudinaryCloudGateway };
