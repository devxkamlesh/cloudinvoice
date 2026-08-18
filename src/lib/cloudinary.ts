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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
];

export async function uploadToCloudinary(
  file: File | string,
  folder = "cloudinvoice"
) {
  try {
    let fileData: string;

    if (typeof file === "string") {
      fileData = file;
    } else {
      // Validate file size and type before reading into memory.
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 10 MB.`);
      }
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        throw new Error(`File type "${file.type}" is not allowed. Accepted: JPEG, PNG, WebP, SVG, PDF.`);
      }

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
    // Re-throw validation errors as-is so the caller sees the specific message.
    if (error instanceof Error && (error.message.includes("too large") || error.message.includes("not allowed"))) {
      throw error;
    }
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
