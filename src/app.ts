import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";

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
app.get("/build", reportController.buildStats);
app.get("/consolidated", reportController.getStats);
app.get("/users/:userId", reportController.getUserReport);
app.get("/users", reportController.getUsersReport);
app.get("/labels", reportController.getLabelsReport);


export default app;
