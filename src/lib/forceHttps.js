export default (req, res, next) => {
  /**
   * Check if the request is not http and not production mode
   */
  if (
    req.headers["x-forwarded-proto"] !== "https" &&
    process.env.NODE_ENV === "production"
  ) {
    res.redirect("https://" + req.hostname + req.url);
  }
  /* Continue to other routes if we're not redirecting */
  next();
};
