import forceHttps from "./lib/forceHttps";
import connectDB from "./config/db";
import { nanoid } from "nanoid";
import Url from "./model/url";
import express from "express";
import chalk from "chalk";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB();
  app.use(forceHttps);
  app.use(cors());
  app.use(express.json());
  app.use(express.static("public"));

  app.get("/", (_, res) => {
    res
      .status(200)
      .send(
        "Welcome to a simple url shortener microservice by Ashal Farhan :)"
      );
  });

  app.post("/new", async (req, res) => {
    let { url, slug } = req.body;
    try {
      if (!slug) {
        slug = nanoid(4);
      } else {
        const isExisting = await Url.findOne({ slug });
        if (isExisting) {
          return res.status(403).json({
            message: "Slug is already used!",
          });
        }
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

  app.listen(PORT, () => {
    console.log(
      chalk.magenta(`[server] Listening on http://localhost:${PORT} \n`)
    );
  });
})();
