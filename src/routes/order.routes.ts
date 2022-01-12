import { Router } from "express";
import { getCustomRepository, getRepository } from "typeorm";
import ensureAuth from "../middlewares/ensureAuth";
import Order from "../models/Order";
import CreateOrderService from "../services/Orders/CreateOrderService";

import * as yup from "yup";
import AppError from "../errors/AppError";
import Paginator from "../middlewares/paginator";
import { classToClass } from "class-transformer";
import SendReportEmailService from "../services/Orders/SendReportEmailService";
import UserRepository from "../repositories/UserRepository";

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

  const orders = await orderRepository.find({
    take: request.pagination.realTake,
    skip: request.pagination.realPage,
    order: {
      created_at: "DESC",
    },
  });

  const allOrders = await orderRepository.find();

  const allTimeAverage =
    allOrders.reduce((acc, actual) => acc + actual.getSubtotal(), 0) /
    allOrders.length;

  const actualPageAverage =
    orders.reduce((acc, actual) => acc + actual.getSubtotal(), 0) /
    orders.length;

  const allTimeRevenue = allOrders.reduce(
    (acc, actual) => acc + actual.getSubtotal(),
    0
  );

  return response.json(
    classToClass({
      allTimeRevenue,
      allTimeAverage: Number(allTimeAverage.toFixed(2)),
      actualPageAverage: Number(actualPageAverage.toFixed(2)),
      results: orders,
    })
  );
});

orderRouter.get("/report-sales", async (request, response) => {
  const orderRepository = getRepository(Order);
  const userRepository = getCustomRepository(UserRepository);

  const user = await userRepository.findOne({
    where: {
      id: request.user.id,
    },
  });

  if (!user) {
    throw new AppError("User not found");
  }

  const allOrders = await orderRepository.find();

  const allTimeAverage =
    allOrders.reduce((acc, actual) => acc + actual.getSubtotal(), 0) /
    allOrders.length;

  const allTimeRevenue = allOrders.reduce(
    (acc, actual) => acc + actual.getSubtotal(),
    0
  );

  const sendReportEmailService = new SendReportEmailService();

  sendReportEmailService.execute({
    allTimeAverage,
    allTimeRevenue,
    email: user.email,
    name: user.name,
  });

  return response.json({
    message: "Sending the email!",
  });
});

export default orderRouter;
