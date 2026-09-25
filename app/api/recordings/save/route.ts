import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recording } from "@/app/models/recording.model";

export async function POST(req: NextRequest) {
  await connectDB();

  const { voice, text } = await req.json();
  const saved = await Recording.create({
    voice,
    text,
  });

  return NextResponse.json({
    success: true,
    id: saved._id.toString(),
  });
}
