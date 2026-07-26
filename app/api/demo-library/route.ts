import { NextRequest, NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

function getS3() {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME;
  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) return null;
  return {
    client: new S3Client({
      region: "auto",
      endpoint,
      forcePathStyle: true,
      credentials: { accessKeyId, secretAccessKey },
    }),
    bucket,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code || code !== process.env.DEMO_LIBRARY_CODE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const s3 = getS3();
  if (!s3) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 500 });
  }

  const publicBase = (process.env.R2_PUBLIC_BASE_URL || "").replace(/\/$/, "");

  try {
    // List both demos/ and images/ prefixes
    const prefixes = ["demos/", "images/"];
    const allFiles: Array<{
      name: string;
      key: string;
      size: number;
      url: string;
      uploadedAt: string;
      category: "audio" | "image";
    }> = [];

    for (const prefix of prefixes) {
      let continuationToken: string | undefined;
      do {
        const response = await s3.client.send(
          new ListObjectsV2Command({
            Bucket: s3.bucket,
            Prefix: prefix,
            MaxKeys: 500,
            ContinuationToken: continuationToken,
          })
        );

        for (const item of response.Contents || []) {
          if (!item.Key) continue;
          // Skip folder placeholders
          if (item.Key.endsWith("/")) continue;
          const url = publicBase ? `${publicBase}/${item.Key}` : `/${item.Key}`;
          allFiles.push({
            name: item.Key.split("/").pop() || item.Key,
            key: item.Key,
            size: item.Size || 0,
            url,
            uploadedAt: item.LastModified?.toISOString() || "",
            category: prefix.startsWith("images") ? "image" : "audio",
          });
        }

        continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
      } while (continuationToken);
    }

    // Sort newest first
    allFiles.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return NextResponse.json({ files: allFiles });
  } catch (error) {
    console.error("Demo library error:", error);
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 });
  }
}
