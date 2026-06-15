import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Dynamic import cloudinary only when needed
async function uploadWithCloudinary(buffer: Buffer, resourceType: "image" | "video") {
  const { uploadToCloudinary } = await import("@/lib/cloudinary");
  return uploadToCloudinary(buffer, { resourceType });
}

function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const useCloudinary = isCloudinaryConfigured();
    const uploadedFiles: { url: string; type: string; name: string }[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name).toLowerCase();
      const allowedImage = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
      const allowedVideo = [".mp4", ".webm", ".mov"];
      const allowed = [...allowedImage, ...allowedVideo];

      if (!allowed.includes(ext)) {
        continue; // skip unsupported files
      }

      const isVideo = allowedVideo.includes(ext);
      const mediaType = isVideo ? "video" : "image";

      if (useCloudinary) {
        // Upload to Cloudinary (persistent, works in production)
        try {
          const result = await uploadWithCloudinary(buffer, mediaType as "image" | "video");
          uploadedFiles.push({
            url: result.url,
            type: mediaType,
            name: file.name,
          });
        } catch (err) {
          console.error(`Cloudinary upload failed for ${file.name}:`, err);
          // Fallback to local
          const localUrl = await saveLocally(buffer, ext);
          uploadedFiles.push({
            url: localUrl,
            type: mediaType,
            name: file.name,
          });
        }
      } else {
        // Local upload (development only)
        const localUrl = await saveLocally(buffer, ext);
        uploadedFiles.push({
          url: localUrl,
          type: mediaType,
          name: file.name,
        });
      }
    }

    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

async function saveLocally(buffer: Buffer, ext: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const uniqueName = `${uuidv4()}${ext}`;
  const filePath = path.join(uploadDir, uniqueName);
  await writeFile(filePath, buffer);
  return `/uploads/${uniqueName}`;
}
