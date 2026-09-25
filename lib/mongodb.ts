import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

export async function connectDB() {
  if (!MONGODB_URI) throw new Error("Mising Env");
  await mongoose.connect(MONGODB_URI);
}
