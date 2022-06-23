import mongoose from "mongoose";
import express from "express";
import routeHandler from "./routes/cache";

const app = express();

export async function init() {
  app.use(express.json());
  app.use(routeHandler);

  // connect to mongodb
  mongoose
    .connect(process.env.MONGODB_URI ?? "")
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
    });

  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
}
