import express from "express";
import pixRoutes from "./api/routes/pix.routes";
import utilRoutes from "./api/routes/util.routes";
import { initializeDatabase } from "./database/db";
import { initInteraction } from "./utils/interaction";
import { PORT } from "./utils/constants";

const app = express();

app.get("/", (_req, res) => {
  res.status(200).send("Hello World!");
});

app.use("/api/pix", pixRoutes);
app.use("/api/util", utilRoutes);

/**
 * Initialize the DB then the Express server.
 */
const startServer = async () => {
  try {
    await initInteraction();
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  } catch (error) {
    console.error("Error initializing the server:", error);
    process.exit(1);
  }
};

startServer();
