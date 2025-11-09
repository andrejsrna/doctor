import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { auth } from "@/app/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { validateAdminOrigin } from "@/app/lib/adminUtils";

function getS3() {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME;
  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) return null;
  return new S3Client({
    region: "auto",
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Validate origin (logs but doesn't block)
    validateAdminOrigin(request);
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
    const skippedFiles = [];
    const errors = [];

    for (const file of files) {
      // Accept both audio and image files
      const isAudio = file.type.startsWith("audio/");
      const isImage = file.type.startsWith("image/");
      
      if (!isAudio && !isImage) {
        skippedFiles.push({ name: file.name, reason: 'Unsupported file type' });
        continue;
      }
      
      // Increased size limits: audio (200MB) and images (20MB)
      const maxSize = isAudio ? 200 * 1024 * 1024 : 20 * 1024 * 1024;
      if (file.size > maxSize) {
        const sizeMB = Math.round(file.size / (1024 * 1024));
        const limitMB = Math.round(maxSize / (1024 * 1024));
        skippedFiles.push({ 
          name: file.name, 
          reason: `File too large (${sizeMB}MB, limit: ${limitMB}MB)` 
        });
        continue;
      }

      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        // Organize files by type
        const fileType = isImage ? 'images' : 'demos';
        const key = `${fileType}/${Date.now()}-${Math.random().toString(36).slice(2)}-${cleanName}`;

        if (useR2 && s3 && bucket) {
          await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: file.type || undefined }));
          const url = publicBase ? `${publicBase}/${key}` : null;
          uploadedFiles.push({
            id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            fileCategory: isImage ? 'image' : 'audio',
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
            fileCategory: isImage ? 'image' : 'audio',
            path: `/uploads/demos/${fileName}`,
            uploadedAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error(`Failed to upload file ${file.name}:`, error);
        errors.push({ 
          name: file.name, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    // Build response message
    let message = `Uploaded ${uploadedFiles.length} files successfully`;
    if (skippedFiles.length > 0) {
      message += `. Skipped ${skippedFiles.length} files.`;
    }
    if (errors.length > 0) {
      message += ` ${errors.length} files failed to upload.`;
    }

    return NextResponse.json({
      success: uploadedFiles.length > 0,
      files: uploadedFiles,
      skipped: skippedFiles,
      errors: errors,
      message
    });

  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
} 
