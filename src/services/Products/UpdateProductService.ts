import { getRepository } from "typeorm";
import AppError from "../../errors/AppError";
import Product from "../../models/Product";

interface Request {
  id: string;
  price: number;
  name: string;
  description: string;
}

class UpdateProductService {
  public async execute({
    id,
    price,
    name,
    description,
  }: Request): Promise<Product> {
    const productRepository = getRepository(Product);

    const product = await productRepository.findOne({
      where: {
        id,
      },
    });

    if (!product) {
      throw new AppError("Not found any product with this id");
    }

    price ? (product.price = price) : product.price;
    name ? (product.name = name) : product.name;
    description ? (product.description = description) : product.description;

    return productRepository.save(product);
  }
}

export default UpdateProductService;
