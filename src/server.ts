import express from "express";
import pixRoutes from "./api/routes/pix.routes";
import utilRoutes from "./api/routes/util.routes";

const app = express();
const PORT = 3000;

app.get("/", (_req, res) => {
  res.status(200).send("Hello World!");
});

app.use("/api/pix", pixRoutes);
app.use("/api/util", utilRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
