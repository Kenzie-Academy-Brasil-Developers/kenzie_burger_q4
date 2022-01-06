import { getCustomRepository } from "typeorm";
import UserRepository from "../../repositories/UserRepository";
import User from "../../models/User";
import { hash } from "bcryptjs";
import AppError from "../../errors/AppError";

interface Request {
  name: string;
  email: string;
  password: string;
}

export default class CreateUserService {
  public async execute({ email, name, password }: Request): Promise<User> {
    const userRepository = getCustomRepository(UserRepository);

    const checkUserExists = await userRepository.findByEmail(email);

    // Promises sem await retornam valores truthy, o que acabam estragando a condicional
    // Promise<pending> === true

    if (checkUserExists) {
      throw new AppError("Email already exists", 401);
    }

    const hashedPassword = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await userRepository.save(user);

    return user;
  }
}
