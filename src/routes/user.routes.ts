import { Router } from "express";

import CreateUserService from "../services/User/CreateUserService";

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

export default userRouter;
