import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function saveBase64Image(dataUrl: string): Promise<string> {
  const matches = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid data URL");

  const ext = matches[1].split("/")[1].replace("jpeg", "jpg");
  const data = matches[2];
  const buffer = Buffer.from(data, "base64");

  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);

  return `/uploads/${filename}`;
}
