import { classToClass } from "class-transformer";
import { Router } from "express";
import { getCustomRepository } from "typeorm";
import ensureAuth from "../middlewares/ensureAuth";
import UserRepository from "../repositories/UserRepository";

import * as yup from "yup";
import AppError from "../errors/AppError";

import CreateUserService from "../services/User/CreateUserService";
import DeleteUserService from "../services/User/DeleteUserService";
import UpdateUserService from "../services/User/UpdateUserService";

const userRouter = Router();

userRouter.post("/", async (request, response) => {
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    name: yup.string().email().required(),
    password: yup.string().required(),
  });

  await schema
    .validate(request.body, { abortEarly: false })
    .catch(({ errors }) => {
      throw new AppError(errors);
    });

  const { name, email, password } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({
    email,
    name,
    password,
  });

  return response.status(201).json(classToClass(user));
});

userRouter.use(ensureAuth);

userRouter.get("/", async (request, response) => {
  const userRepository = getCustomRepository(UserRepository);

  const users = await userRepository.find();

  return response.json(classToClass(users));
});

// /users/profile
userRouter.patch("/profile", async (request, response) => {
  const { name, email, password, old_password } = request.body;

  const updateUser = new UpdateUserService();

  const user = await updateUser.execute({
    name,
    email,
    password,
    old_password,
    user_id: request.user.id,
  });

  return response.json(classToClass(user));
});

// /users/profile
userRouter.delete("/profile", async (request, response) => {
  const deleteUser = new DeleteUserService();

  await deleteUser.execute({
    id: request.user.id,
  });

  return response.status(204).json();
});

export default userRouter;
