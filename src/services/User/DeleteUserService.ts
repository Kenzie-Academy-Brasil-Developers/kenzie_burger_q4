import { DeleteResult, getCustomRepository } from "typeorm";
import AppError from "../../errors/AppError";
import UserRepository from "../../repositories/UserRepository";

interface Request {
  id: string;
}

class DeleteUserService {
  public async execute({ id }: Request): Promise<DeleteResult> {
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new AppError("Not found any user with this id");
    }

    return userRepository.delete(id);
  }
}

export default DeleteUserService;
