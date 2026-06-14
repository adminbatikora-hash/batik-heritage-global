import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

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
      const uniqueName = `${uuidv4()}${ext}`;
      const filePath = path.join(uploadDir, uniqueName);

      await writeFile(filePath, buffer);

      uploadedFiles.push({
        url: `/uploads/${uniqueName}`,
        type: isVideo ? "video" : "image",
        name: file.name,
      });
    }

    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
