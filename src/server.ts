import express from "express";
import pixRoutes from "./api/routes/pix.routes";

const app = express();
const PORT = 3000;

app.get("/", (_req, res) => {
  res.status(200).send("Hello World!");
});

app.use("/api/pix", pixRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
