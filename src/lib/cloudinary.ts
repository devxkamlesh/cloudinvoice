import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

/**
 * Upload a file to Cloudinary
 * @param file - File object or base64 string
 * @param folder - Cloudinary folder path (default: "cloudinvoice")
 * @returns Upload result with secure_url and public_id
 */
export async function uploadToCloudinary(
  file: File | string,
  folder = "cloudinvoice"
) {
  try {
    let fileData: string;

    if (typeof file === "string") {
      fileData = file;
    } else {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fileData = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    const result = await cloudinary.uploader.upload(fileData, {
      folder,
      resource_type: "auto",
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload file to Cloudinary");
  }
}

/**
 * Delete a file from Cloudinary
 * @param publicId - Cloudinary public ID
 * @param resourceType - Resource type (image, video, raw)
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete file from Cloudinary");
  }
}
