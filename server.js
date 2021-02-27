import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import Url from "./model/url.js";
import { nanoid } from "nanoid";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (_, res) => {
  res.status(200).send("Welcome to a simple url shortener microservice");
});

app.post("/new", async (req, res, next) => {
  let { url, slug } = req.body;
  try {
    if (!slug) {
      slug = nanoid(4);
    } else {
      const isExisting = await Url.find({ slug });
      if (isExisting.length > 0) throw Error("Slug is in use");
    }
    const newUrl = new Url({
      slug,
      url,
    });
    const result = await newUrl.save();
    if (!result) throw Error("Cannot save the url to the database");
    res.status(200).json({
      message: "Successfully Created Slug",
      result,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await Url.findOne({ slug });
    if (!result) throw Error("Cannot get the slug");
    res.redirect(result.url);
  } catch (error) {
    return res.redirect(`/?error=Link not found`);
  }
});

app.listen(port, () => {
  console.log(`\n >Listening on http://localhost:${port} \n`);
});
