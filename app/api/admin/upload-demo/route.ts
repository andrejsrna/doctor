import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), "public", "uploads", "demos");
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error("Error creating upload directory:", error);
    }

    const uploadedFiles = [];

    for (const file of files) {
      if (!file.type.startsWith("audio/")) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      uploadedFiles.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        path: `/uploads/demos/${fileName}`,
        uploadedAt: new Date().toISOString()
      });
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