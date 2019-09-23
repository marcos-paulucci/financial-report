import express from "express";
import bodyParser from "body-parser";

import { buildStats, getTotalRevenue, getStats, getUserReport, getUsersReport, getLabelsReport } from "./controllers/mainController";

const app = express();
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Routes.
 */
app.get("/build", buildStats);
app.get("/revenue", getTotalRevenue);
app.get("/consolidated", getStats);
app.get("/users/:userId", getUserReport);
app.get("/users", getUsersReport);
app.get("/report", getLabelsReport);


export default app;
