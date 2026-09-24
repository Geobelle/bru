import { Schema, model, models } from "mongoose";

const recordingSchema = new Schema(
  {
    voice: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Recording =
  models.Recording || model("Recording", recordingSchema);
