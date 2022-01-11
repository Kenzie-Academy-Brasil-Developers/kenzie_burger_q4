import { Router } from "express";
import orderRouter from "./order.routes";
import productRouter from "./product.routes";
import sessionRouter from "./session.routes";
import userRouter from "./user.routes";

const routes = Router();

routes.use("/users", userRouter);
routes.use("/sessions", sessionRouter);
routes.use("/products", productRouter);
routes.use("/orders", orderRouter);

export default routes;
