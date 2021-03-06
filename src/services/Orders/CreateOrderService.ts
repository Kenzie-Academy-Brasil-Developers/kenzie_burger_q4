import { getRepository } from "typeorm";
import AppError from "../../errors/AppError";

import Order from "../../models/Order";
import OrderProduct from "../../models/OrderProduct";
import Product from "../../models/Product";

interface Request {
  desk: string;
  products_ids: string[];
}

export default class CreateOrderService {
  public async execute({ desk, products_ids }: Request): Promise<Order> {
    const orderRepository = getRepository(Order);
    const orderProductsRepository = getRepository(OrderProduct);
    const productsRepository = getRepository(Product);

    const products = await productsRepository.findByIds(products_ids);

    if (!products[products_ids.length - 1]) {
      throw new AppError("Invalid list of ids");
    }

    const order = orderRepository.create({
      desk,
    });

    await orderRepository.save(order);

    products_ids.forEach(async (productId) => {
      const orderProduct = orderProductsRepository.create({
        order: {
          id: order.id,
        },
        product: {
          id: productId,
        },
      });

      await orderProductsRepository.save(orderProduct);
    });

    return order;
  }
}
