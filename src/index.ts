import express from "express";
import cors from "cors";
import { config } from "./config/config";
import router from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

app.use("/", router);

app.get("/status", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

export default app;
