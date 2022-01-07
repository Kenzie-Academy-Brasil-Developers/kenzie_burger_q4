import { classToClass } from "class-transformer";
import { Router } from "express";
import { getCustomRepository } from "typeorm";
import UserRepository from "../repositories/UserRepository";

import CreateUserService from "../services/User/CreateUserService";
import DeleteUserService from "../services/User/DeleteUserService";
import UpdateUserService from "../services/User/UpdateUserService";

const userRouter = Router();

userRouter.post("/", async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({
    email,
    name,
    password,
  });

  return response.status(201).json(user);
});

userRouter.get("/", async (request, response) => {
  const userRepository = getCustomRepository(UserRepository);

  const users = await userRepository.find();

  return response.json(classToClass(users));
});

userRouter.patch("/:user_id", async (request, response) => {
  const { user_id } = request.params;
  const { name, email, password, old_password } = request.body;

  const updateUser = new UpdateUserService();

  const user = await updateUser.execute({
    name,
    email,
    password,
    old_password,
    user_id,
  });

  return response.json(classToClass(user));
});

userRouter.delete("/:user_id", async (request, response) => {
  const { user_id } = request.params;

  const deleteUser = new DeleteUserService();

  await deleteUser.execute({
    id: user_id,
  });

  return response.status(204).json();
});

export default userRouter;
