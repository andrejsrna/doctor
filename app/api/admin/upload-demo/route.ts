import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { auth } from "@/app/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    const useR2 = true; // placeholder until envs are provided
    // const r2PublicBase = process.env.R2_PUBLIC_BASE_URL;

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
      if (!file.type.startsWith("audio/")) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
      if (!useR2) {
        const filePath = join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        uploadedFiles.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
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