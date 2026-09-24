import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recording } from "@/app/models/recording.model";

export async function GET(req: NextRequest) {
  await connectDB();
  console.log("connected successfully");

  const saved = await Recording.find();

  return NextResponse.json({
    success: true,
    data: saved,
  });
}
