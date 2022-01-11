import { Router } from "express";
import AuthService from "../services/Session/AuthService";
import { classToClass } from "class-transformer";
import * as yup from "yup";
import AppError from "../errors/AppError";

const sessionRouter = Router();

sessionRouter.post("/", async (request, response) => {
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  await schema
    .validate(request.body, { abortEarly: false })
    .catch(({ errors }) => {
      throw new AppError(errors);
    });

  const { email, password } = request.body;

  const authUser = new AuthService();

  const userResponse = await authUser.execute({
    email,
    password,
  });

  return response.json(classToClass(userResponse));
});

export default sessionRouter;
