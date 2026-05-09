import { PutBucketCorsCommand, S3Client } from "@aws-sdk/client-s3"

async function main() {
  const endpoint = process.env.R2_ENDPOINT
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucket = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
    console.error("Missing R2 env vars: R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET")
    process.exit(1)
  }

  const s3 = new S3Client({
    region: "auto",
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  })

  await s3.send(
    new PutBucketCorsCommand({
      Bucket: bucket,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: [
              "https://dnbdoctor.com",
              "https://admin.dnbdoctor.com",
              "https://www.dnbdoctor.com",
              "http://localhost:3000",
            ],
            AllowedMethods: ["PUT", "GET"],
            AllowedHeaders: ["Content-Type", "Content-Length"],
            ExposeHeaders: ["ETag"],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    })
  )

  console.log(`✓ CORS configured on R2 bucket: ${bucket}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
