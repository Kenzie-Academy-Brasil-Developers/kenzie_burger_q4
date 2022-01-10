import { Router } from "express";
import productRouter from "./product.routes";
import sessionRouter from "./session.routes";
import userRouter from "./user.routes";

const routes = Router();

routes.use("/users", userRouter);
routes.use("/sessions", sessionRouter);
routes.use("/products", productRouter);

export default routes;
