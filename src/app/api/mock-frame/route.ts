import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public/videos/2025-01-24_15-05-49.mp4");
    const imageBuffer = fs.readFileSync(filePath);
    const base64 = imageBuffer.toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;

    return NextResponse.json({ dataUrl });
  } catch (error) {
    console.error("Error reading image file:", error);
    return NextResponse.json(
      { error: "Failed to read image" },
      { status: 500 }
    );
  }
}
