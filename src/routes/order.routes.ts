import { Router } from "express";
import { getRepository } from "typeorm";
import ensureAuth from "../middlewares/ensureAuth";
import Order from "../models/Order";
import CreateOrderService from "../services/Orders/CreateOrderService";

import * as yup from "yup";
import AppError from "../errors/AppError";
import Paginator from "../middlewares/paginator";

const orderRouter = Router();

orderRouter.post("/", async (request, response) => {
  const schema = yup.object().shape({
    desk: yup.string().required(),
    products_ids: yup.array().required(),
  });

  await schema
    .validate(request.body, { abortEarly: false })
    .catch(({ errors }) => {
      throw new AppError(errors);
    });

  const { desk, products_ids } = request.body;

  const createOrder = new CreateOrderService();

  const order = await createOrder.execute({
    desk,
    products_ids,
  });

  return response.status(201).json(order);
});

orderRouter.use(ensureAuth);
orderRouter.use(Paginator);

orderRouter.get("/", async (request, response) => {
  const orderRepository = getRepository(Order);

  const orders = await orderRepository
    .find({
      take: request.pagination.realTake,
      skip: request.pagination.realPage,
    })
    .catch((err) => {
      throw new AppError("Invalid page");
    });

  return response.json({
    page: request.pagination.realPage,
    result: orders,
  });
});

export default orderRouter;
