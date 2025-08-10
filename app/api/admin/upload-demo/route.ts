import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { auth } from "@/app/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

function getS3() {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME;
  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) return null;
  return new S3Client({ region: "auto", endpoint, credentials: { accessKeyId, secretAccessKey } });
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const origin = request.headers.get("origin");
    const requestOrigin = new URL(request.url).origin;
    if (origin && origin !== requestOrigin) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    const s3 = getS3();
    const bucket = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME;
    const publicBase = (process.env.R2_PUBLIC_BASE_URL || "").replace(/\/$/, "");
    const useR2 = Boolean(s3 && bucket);

    const uploadDir = join(process.cwd(), "public", "uploads", "demos");
    if (!useR2) {
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error) {
        console.error("Error creating upload directory:", error);
      }
    }

    const uploadedFiles = [];

    for (const file of files) {
      if (!file.type.startsWith("audio/")) continue;
      if (file.size > 100 * 1024 * 1024) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const key = `demos/${Date.now()}-${Math.random().toString(36).slice(2)}-${cleanName}`;

      if (useR2 && s3 && bucket) {
        await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: file.type || undefined }));
        const url = publicBase ? `${publicBase}/${key}` : null;
        uploadedFiles.push({
          id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          path: url || key,
          url: url || undefined,
          uploadedAt: new Date().toISOString(),
        });
      } else {
        const fileName = key.split("/").slice(-1)[0];
        const filePath = join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        uploadedFiles.push({
          id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          path: `/uploads/demos/${fileName}`,
          uploadedAt: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `Uploaded ${uploadedFiles.length} files successfully`
    });

  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
} 