import { DeleteResult, getRepository } from "typeorm";
import AppError from "../../errors/AppError";
import Product from "../../models/Product";

interface Request {
  id: string;
}

class DeleteProductService {
  public async execute({ id }: Request): Promise<DeleteResult> {
    const productRepository = getRepository(Product);

    const product = await productRepository.findOne({
      where: {
        id,
      },
    });

    if (!product) {
      throw new AppError("Not found any product with this id");
    }

    return productRepository.delete(id);
  }
}

export default DeleteProductService;
