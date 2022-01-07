import { getCustomRepository } from "typeorm";
import AppError from "../../errors/AppError";
import User from "../../models/User";
import UserRepository from "../../repositories/UserRepository";
import { compare } from "bcryptjs";
import authConfig from "../../config/auth";
import { sign } from "jsonwebtoken";

interface Request {
  email: string;
  password: string;
}

interface Response {
  token: string;
  user: User;
}

export default class AuthService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Incorrect email / password combination", 401);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Incorrect email / password combination", 401);
    }

    const { expiresIn, secret } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}
