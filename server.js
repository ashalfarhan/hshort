import connectDB from "./config/db.js";
import bodyParser from "body-parser";
import Url from "./model/url.js";
import { nanoid } from "nanoid";
import express from "express";
import "dotenv/config.js";
import cors from "cors";
import chalk from "chalk";

const app = express();
const port = process.env.PORT || 3000;
(async function () {
  /* Redirect http to https */
  app.use((req, res, next) => {
    if (
      req.headers["x-forwarded-proto"] !== "https" &&
      process.env.NODE_ENV === "production"
    )
      res.redirect("https://" + req.hostname + req.url);
    else next(); /* Continue to other routes if we're not redirecting */
  });
  app.use(cors());
  app.use(bodyParser.json());
  app.use(express.static("./public"));
  await connectDB();

  app.get("/", (_, res) => {
    res.status(200).send("Welcome to a simple url shortener microservice");
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

  app.listen(port, () => {
    console.log(
      chalk.magenta(`[server] Listening on http://localhost:${port} \n`)
    );
  });
})();
