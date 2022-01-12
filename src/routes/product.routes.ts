import { Router } from "express";
import { getRepository } from "typeorm";
import ensureAuth from "../middlewares/ensureAuth";
import Product from "../models/Product";
import * as yup from "yup";

import CreateProductService from "../services/Products/CreateProductService";
import DeleteProductService from "../services/Products/DeleteProductService";
import UpdateProductService from "../services/Products/UpdateProductService";
import AppError from "../errors/AppError";
import Paginator from "../middlewares/paginator";

const productRouter = Router();

productRouter.use(Paginator);

productRouter.get("/", async (request, response) => {
  const productRepository = getRepository(Product);

  console.log(request.pagination.realPage, request.pagination.realTake);

  const products = await productRepository.find({
    take: request.pagination.realTake,
    skip: request.pagination.realPage,
  });

  return response.json(products);
});

productRouter.use(ensureAuth);

productRouter.post("/", async (request, response) => {
  const schema = yup.object().shape({
    description: yup.string().required(),
    name: yup.string().required(),
    price: yup.number().required(),
  });

  await schema
    .validate(request.body, { abortEarly: false })
    .catch(({ errors }) => {
      throw new AppError(errors);
    });

  const { description, name, price } = request.body;

  const createProduct = new CreateProductService();

  const product = await createProduct.execute({
    description,
    name,
    price,
  });

  return response.json(product);
});

productRouter.patch("/:product_id", async (request, response) => {
  const { product_id } = request.params;
  const { description, name, price } = request.body;

  const updateProduct = new UpdateProductService();

  const product = await updateProduct.execute({
    id: product_id,
    description,
    name,
    price,
  });

  return response.json(product);
});

productRouter.delete("/:product_id", async (request, response) => {
  const { product_id } = request.params;
  const deleteProduct = new DeleteProductService();

  await deleteProduct.execute({
    id: product_id,
  });

  return response.status(204).json();
});

export default productRouter;
