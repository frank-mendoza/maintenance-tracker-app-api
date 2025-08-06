import { v2 as cloudinary } from "cloudinary";
import { formatImage } from "../middleware/multerMiddleware";
import { BadRequestError } from "../errors/customErrors";

type CloudinaryUploadResult = {
  path: string;
  public_id: string;
};

export const uploadMultipleImages = async (
  files: any[],
  folder = "default-folder"
): Promise<CloudinaryUploadResult[]> => {
  const imageUrls: CloudinaryUploadResult[] = [];

  for (const file of files) {
    const file64 = formatImage(file);
    if (typeof file64 !== "string") {
      throw new BadRequestError("Invalid image format");
    }

    const uploadRes = await cloudinary.uploader.upload(file64, { folder });

    imageUrls.push({
      path: uploadRes.secure_url,
      public_id: uploadRes.public_id,
    });
  }

  return imageUrls;
};
