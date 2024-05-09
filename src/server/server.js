import express from "express";
import logger from "morgan";

const app = express();
const port = 3000;
app.use(logger("dev"));
app.use(express.static("src/docs/milestone-03"))
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });