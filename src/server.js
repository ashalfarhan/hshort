import forceHttps from "./lib/forceHttps";
import connectDB from "./config/db";
import { nanoid } from "nanoid";
import Url from "./model/url";
import express from "express";
import chalk from "chalk";
import helmet from "helmet";
import "dotenv/config";

(async () => {
  const app = express();
  const PORT = process.env.PORT || 3000;
  // app.use(forceHttps);
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
  app.use(express.json());
  app.use(express.static("public"));
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
          return res.status(401).json({
            ok: false,
            message: "Slug is already used!",
          });
        }
      }
      const newUrl = new Url({
        slug,
        url,
      });
      const result = await newUrl.save();
      res.status(200).json({
        ok: true,
        message: "Successfully Created Slug",
        result,
      });
    } catch (error) {
      res.status(401).json({
        ok: false,
        message: error.message,
      });
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
      chalk.magenta(`[server] Listening on http://localhost:${PORT}`)
    );
  });
})().catch((e) => {
  console.log(chalk.bgMagenta(`[server] Error: `, e.message));
});
