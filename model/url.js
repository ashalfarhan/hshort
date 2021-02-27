import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UrlSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
});

const Url = model("url", UrlSchema);

export default Url;
