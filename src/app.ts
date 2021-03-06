import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import connection from "./database";
import AppError from "./errors/AppError";
import routes from "./routes";

connection();

const app = express();

app.use(express.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server started on port 3333");
});

export default app;
