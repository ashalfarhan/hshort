import { Schema, model } from "mongoose";

export default model(
  "url",
  new Schema({
    url: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
  })
);
