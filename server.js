require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const yup = require("yup");
const { nanoid } = require("nanoid");
const dns = require("dns");

// Variable Configuration and local database(array)
const app = express();
const port = process.env.PORT || 3000;
const urlSchema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
});
const database = [];

// Using some method
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

// Serve html to index page / first load
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

// First endpoint to api
app.get("/api/hello", (req, res) => {
  res.json({
    greeting: "Welcome to the API",
  });
});

// Create new item to database
app.post("/new", async (req, res, next) => {
  // Destructure url from body
  let { url, slug } = req.body;

  try {
    if (!slug) {
      slug = nanoid(6);
    } else {
      const existing = await database.find((data) => data.slug === slug);
      if (existing) {
        throw new Error("Slug in use!");
      }
    }
    await urlSchema.validate({
      slug,
      url,
    });
    slug = slug.toLowerCase();

    const newUrl = {
      url,
      slug,
    };
    database.push(newUrl);

    return res.json(newUrl);
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? "Stack" : error.stack,
  });
});

// Redirect to the original url based on slug parameter
app.get("/:id", (req, res, next) => {
  // Destructure id from params
  const { id: slug } = req.params;

  try {
    // Find the item from the database by id
    // IMPORTANT!!
    // the id that given from req.params is a STRING,
    // convert id that given from new endpoint to string
    const result = database.find((data) => data.slug === slug);

    // Check if the url found
    if (result) {
      return res.redirect(result.url);
    } else {
      return res.redirect(`/?error=${slug} not found`);
    }
  } catch (error) {
    return res.redirect(`/?error=Link not found`);
  }
});

// Listening Configuration
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
