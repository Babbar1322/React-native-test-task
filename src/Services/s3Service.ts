import RNFS from "react-native-fs";
import CryptoJS from "crypto-js";

// AWS Configuration
const AWS_CONFIG = {
  accessKeyId: "YOUR_AWS_ACCESS_KEY",
  secretAccessKey: "YOUR_AWS_SECRET_KEY",
  region: "eu-north-1",
  bucketName: "baccvs-bucket",
  bucketPath: "https://baccvs-bucket.s3.eu-north-1.amazonaws.com/",
  service: "s3",
};

interface UploadImageParams {
  uri: string;
  userId: string; // Required: User ID from Redux userData._id
  fileName?: string;
  folder?: string;
  onProgress?: (progress: number) => void;
}

interface UploadImageResponse {
  success: boolean;
  url?: string;
  key?: string;
  message?: string;
  error?: string;
}

/**
 * AWS Signature Version 4 Helper Functions
 */
const getSignatureKey = (
  key: string,
  dateStamp: string,
  regionName: string,
  serviceName: string
): CryptoJS.lib.WordArray => {
  const kDate = CryptoJS.HmacSHA256(dateStamp, "AWS4" + key);
  const kRegion = CryptoJS.HmacSHA256(regionName, kDate);
  const kService = CryptoJS.HmacSHA256(serviceName, kRegion);
  const kSigning = CryptoJS.HmacSHA256("aws4_request", kService);
  return kSigning;
};

const getAmzDate = (): { amzDate: string; dateStamp: string } => {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  return { amzDate, dateStamp };
};

const sha256Hash = (message: string): string => {
  return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
};

/**
 * Convert a Uint8Array to CryptoJS WordArray for proper binary hashing
 */
const uint8ArrayToWordArray = (
  uint8Array: Uint8Array
): CryptoJS.lib.WordArray => {
  const words: number[] = [];
  for (let i = 0; i < uint8Array.length; i += 4) {
    const word =
      (uint8Array[i] << 24) |
      ((uint8Array[i + 1] || 0) << 16) |
      ((uint8Array[i + 2] || 0) << 8) |
      (uint8Array[i + 3] || 0);
    words.push(word);
  }
  return CryptoJS.lib.WordArray.create(words, uint8Array.length);
};

/**
 * Hash binary data (Uint8Array) with SHA256
 */
const sha256HashBinary = (data: Uint8Array): string => {
  const wordArray = uint8ArrayToWordArray(data);
  return CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
};

/**
 * Generate AWS4 signed headers for S3 PUT request
 */
const generateAWS4SignedHeaders = (
  method: string,
  s3Key: string,
  contentType: string,
  contentLength: number,
  payloadHash: string
): { [key: string]: string } => {
  const { amzDate, dateStamp } = getAmzDate();
  const host = `${AWS_CONFIG.bucketName}.s3.${AWS_CONFIG.region}.amazonaws.com`;
  const canonicalUri = "/" + s3Key.split("/").map(encodeURIComponent).join("/");
  const canonicalQueryString = "";

  const canonicalHeaders =
    `content-length:${contentLength}\n` +
    `content-type:${contentType}\n` +
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;

  const signedHeaders =
    "content-length;content-type;host;x-amz-content-sha256;x-amz-date";

  const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/${AWS_CONFIG.region}/${AWS_CONFIG.service}/aws4_request`;
  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${sha256Hash(
    canonicalRequest
  )}`;

  const signingKey = getSignatureKey(
    AWS_CONFIG.secretAccessKey,
    dateStamp,
    AWS_CONFIG.region,
    AWS_CONFIG.service
  );
  const signature = CryptoJS.HmacSHA256(stringToSign, signingKey).toString(
    CryptoJS.enc.Hex
  );

  const authorizationHeader =
    `${algorithm} Credential=${AWS_CONFIG.accessKeyId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return {
    Authorization: authorizationHeader,
    "Content-Type": contentType,
    "Content-Length": contentLength.toString(),
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };
};

/**
 * Convert base64 string to Uint8Array for S3 upload
 */
const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * Read file from URI and return as base64 (React Native compatible)
 */
const readFileAsBase64 = async (
  uri: string
): Promise<{ base64: string; mimeType: string }> => {
  try {
    const filePath = uri.startsWith("file://") ? uri.slice(7) : uri;
    const base64Data = await RNFS.readFile(filePath, "base64");

    const ext = filePath.split(".").pop()?.toLowerCase() || "jpg";
    const mimeTypes: { [key: string]: string } = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      heic: "image/heic",
      heif: "image/heif",
    };
    const mimeType = mimeTypes[ext] || "image/jpeg";

    return { base64: base64Data, mimeType };
  } catch (error) {
    throw new Error(`Error reading file from URI: ${error}`);
  }
};

/**
 * Extract file name and extension from URI
 */
const extractFileName = (uri: string): { name: string; ext: string } => {
  const parts = uri.split("/");
  const fileName = parts[parts.length - 1];
  const [name, ext] = fileName.includes(".")
    ? fileName.split(/\.(?=[^.]*$)/)
    : [fileName, "jpg"];
  return { name, ext };
};

/**
 * Upload a single image to S3 using XMLHttpRequest with AWS4 signature
 * This method is fully React Native compatible
 */
export const uploadImageToS3 = async (
  params: UploadImageParams
): Promise<UploadImageResponse> => {
  try {
    const { uri, userId, fileName: customFileName, folder = "photos" } = params;

    if (!uri) {
      return { success: false, error: "Image URI is required" };
    }

    if (!userId) {
      return {
        success: false,
        error: "User ID is required for uploading images",
      };
    }

    console.log("🔍 Starting S3 upload...");
    console.log("URI:", uri);
    console.log("UserID:", userId);

    // Read file as base64
    const { base64, mimeType } = await readFileAsBase64(uri);
    const { name, ext } = extractFileName(uri);

    const uniqueFileName =
      customFileName ||
      `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const finalFileName = `${uniqueFileName}.${ext}`;
    const s3Key = `${folder}/${userId}/${finalFileName}`;

    console.log("📤 Uploading to S3 with key:", s3Key);

    // Convert base64 to Uint8Array for upload
    const bytes = base64ToUint8Array(base64);

    // Hash the actual binary data that will be sent
    const payloadHash = sha256HashBinary(bytes);

    // Generate signed headers
    const headers = generateAWS4SignedHeaders(
      "PUT",
      s3Key,
      mimeType,
      bytes.length,
      payloadHash
    );

    // Upload URL
    const uploadUrl = `https://${AWS_CONFIG.bucketName}.s3.${AWS_CONFIG.region}.amazonaws.com/${s3Key}`;

    // Use XMLHttpRequest for upload (React Native compatible)
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl, true);

      // Set headers (excluding Host which is set automatically)
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const imageUrl = `${AWS_CONFIG.bucketPath}${s3Key}`;
          console.log("✅ Upload successful! URL:", imageUrl);
          resolve({
            success: true,
            url: imageUrl,
            key: s3Key,
            message: "Image uploaded successfully",
          });
        } else {
          console.error("Upload failed:", xhr.status, xhr.responseText);
          resolve({
            success: false,
            error: `Upload failed with status ${xhr.status}: ${xhr.responseText}`,
          });
        }
      };

      xhr.onerror = () => {
        console.error("XHR Error:", xhr.statusText);
        resolve({
          success: false,
          error: `Network error: ${xhr.statusText}`,
        });
      };

      if (params.onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && params.onProgress) {
            const progress = Math.round((event.loaded / event.total) * 100);
            params.onProgress(progress);
          }
        };
      }

      // Send the binary data (bytes already converted above)
      xhr.send(bytes.buffer);
    });
  } catch (error: any) {
    console.error("S3 Upload Error:", error);
    return {
      success: false,
      error: error.message || "Failed to upload image to S3",
    };
  }
};

/**
 * Upload multiple images to S3 in sequence
 */
export const uploadMultipleImagesToS3 = async (
  imageUris: string[],
  userId: string,
  folder: string = "photos",
  onProgress?: (current: number, total: number) => void
): Promise<UploadImageResponse[]> => {
  try {
    if (!imageUris || imageUris.length === 0) {
      return [{ success: false, error: "No images provided" }];
    }

    if (!userId) {
      return [
        { success: false, error: "User ID is required for uploading images" },
      ];
    }

    const totalImages = imageUris.length;
    const results: UploadImageResponse[] = [];

    console.log(`🎬 Starting batch upload of ${totalImages} images...`);

    for (let i = 0; i < imageUris.length; i++) {
      const result = await uploadImageToS3({
        uri: imageUris[i],
        userId,
        folder,
      });

      results.push(result);
      console.log(
        `Image ${i + 1}/${totalImages}: ${result.success ? "✅" : "❌"}`
      );

      if (onProgress) {
        onProgress(i + 1, totalImages);
      }
    }

    console.log(
      `✅ Batch upload complete. Success: ${
        results.filter((r) => r.success).length
      }/${totalImages}`
    );
    return results;
  } catch (error: any) {
    console.error("Batch Upload Error:", error);
    return [
      {
        success: false,
        error: error.message || "Failed to upload images",
      },
    ];
  }
};

/**
 * Delete an image from S3 using XMLHttpRequest with AWS4 signature
 */
export const deleteImageFromS3 = async (
  s3Key: string
): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    if (!s3Key) {
      return { success: false, error: "S3 key is required" };
    }

    const { amzDate, dateStamp } = getAmzDate();
    const host = `${AWS_CONFIG.bucketName}.s3.${AWS_CONFIG.region}.amazonaws.com`;
    const canonicalUri =
      "/" + s3Key.split("/").map(encodeURIComponent).join("/");
    const payloadHash = sha256Hash("");

    const canonicalHeaders =
      `host:${host}\n` +
      `x-amz-content-sha256:${payloadHash}\n` +
      `x-amz-date:${amzDate}\n`;

    const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
    const canonicalRequest = `DELETE\n${canonicalUri}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${dateStamp}/${AWS_CONFIG.region}/${AWS_CONFIG.service}/aws4_request`;
    const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${sha256Hash(
      canonicalRequest
    )}`;

    const signingKey = getSignatureKey(
      AWS_CONFIG.secretAccessKey,
      dateStamp,
      AWS_CONFIG.region,
      AWS_CONFIG.service
    );
    const signature = CryptoJS.HmacSHA256(stringToSign, signingKey).toString(
      CryptoJS.enc.Hex
    );

    const authorizationHeader =
      `${algorithm} Credential=${AWS_CONFIG.accessKeyId}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const deleteUrl = `https://${host}${canonicalUri}`;

    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("DELETE", deleteUrl, true);
      xhr.setRequestHeader("Authorization", authorizationHeader);
      xhr.setRequestHeader("x-amz-content-sha256", payloadHash);
      xhr.setRequestHeader("x-amz-date", amzDate);

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ success: true, message: "Image deleted successfully" });
        } else {
          resolve({
            success: false,
            error: `Delete failed with status ${xhr.status}`,
          });
        }
      };

      xhr.onerror = () => {
        resolve({ success: false, error: `Network error: ${xhr.statusText}` });
      };

      xhr.send();
    });
  } catch (error: any) {
    console.error("S3 Delete Error:", error);
    return { success: false, error: error.message || "Failed to delete image" };
  }
};

/**
 * Generate public URL for an S3 object
 */
export const generatePublicUrl = (s3Key: string): string => {
  return `${AWS_CONFIG.bucketPath}${s3Key}`;
};

export default {
  uploadImageToS3,
  uploadMultipleImagesToS3,
  deleteImageFromS3,
  generatePublicUrl,
};
