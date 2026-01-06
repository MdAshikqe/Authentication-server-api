import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import notFound from "./app/middleware/notFound";
import globalErrorHandaler from "./app/middleware/globalErrorHandler";

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Authentication server port is running",
  });
});

app.use("/api/v1", router);
app.use(notFound);
app.use(globalErrorHandaler);

export default app;
