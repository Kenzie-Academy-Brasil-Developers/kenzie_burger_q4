import { getRepository } from "typeorm";
import Product from "../../models/Product";

interface Request {
  name: string;
  price: number;
  description: string;
}

export default class CreateProductService {
  public async execute({
    description,
    name,
    price,
  }: Request): Promise<Product> {
    const productRepository = getRepository(Product);

    const product = productRepository.create({
      description,
      name,
      price,
    });

    await productRepository.save(product);

    return product;
  }
}
