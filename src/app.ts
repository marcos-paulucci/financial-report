import express from "express";
import compression from "compression";  // compresses requests

import bodyParser from "body-parser";
import path from "path";
import bluebird from "bluebird";

// Controllers (route handlers)
import * as reportController from "./controllers/reports";

// Create Express server
const app = express();
// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());

app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Primary app routes.
 */
app.get("/streamingFile/:fileName", reportController.testGetStreamingFile);
app.get("/HTTPGet/:url", reportController.testGetHTTPResponse);

export default app;
