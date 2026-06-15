import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import os from "os";

export const runtime = "nodejs";

const MIME_MAP: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

export async function GET(request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  if (!filename || filename.includes("..") || filename.includes("/")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const ext = path.extname(filename).slice(1).toLowerCase();
  const mime = MIME_MAP[ext] || "application/octet-stream";

  const paths = [
    path.join(process.cwd(), "public", "uploads", filename),
    path.join(os.tmpdir(), "uploads", filename),
  ];

  for (const filepath of paths) {
    try {
      const buffer = await readFile(filepath);
      return new NextResponse(buffer, { headers: { "Content-Type": mime, "Cache-Control": "public, max-age=31536000" } });
    } catch {}
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
