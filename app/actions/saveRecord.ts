import { connectDB } from "@/lib/mongodb";
import { Recording } from "../models/recording.model";

export async function saveRecording(formData: { voice: string; text: string }) {
  await connectDB();
  await Recording.create(formData);
}
