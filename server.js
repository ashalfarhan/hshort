require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dns = require("dns");

// Variable Configuration and local database(array)
const app = express();
const port = process.env.PORT || 3000;
const links = [];
let id = 0;

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
app.post("/api/shorturl/new", (req, res) => {
  // Destructure url from body
  const { url } = req.body;

  // Remove https with regex
  const noHTTPSurl = url.replace(/^https?:\/\//, "");

  // Check if url is valid
  dns.lookup(noHTTPSurl, (err) => {
    if (err) {
      res.json({
        error: "Invalid URL",
      });
    } else {
      // Create id by creating every req is received
      id++;

      // Create link template
      const link = {
        original_url: url,
        // IMPORTANT!!
        // the id that created is a number, so change it to string
        // before store it to the database,
        // also when redirecting to the original url,
        // the find method is shold match the req.params
        // that is typeof String
        short_url: `${id}`,
      };

      // Add link that have been created to database
      links.push(link);
      console.log("New link added", link);

      return res.json(link);
    }
  });
});

// Redirect to the original url based on id parameter
app.get("/api/shorturl/:id", (req, res) => {
  // Destructure id from params
  const { id } = req.params;

  // Find the item from the database by id
  // IMPORTANT!!
  // the id that given from req.params is a STRING,
  // convert id that given from new endpoint to string
  const result = links.find((l) => l.short_url === id);

  // Check if the url found
  if (result) {
    return res.redirect(result.original_url);
  } else {
    return res.json({
      error: "No such URL found!",
    });
  }
});

// Listening Configuration
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
