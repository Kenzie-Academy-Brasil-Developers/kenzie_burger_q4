import { Request, Response, NextFunction } from "express";

export default function Paginator(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  let { perPage, page } = request.query;

  let realPage: number;
  let realTake: number;

  if (perPage) realTake = +perPage;
  else {
    perPage = "15";
    realTake = 15;
  }

  if (page) realPage = +page === 1 ? 0 : +page - 1 * realTake;
  else {
    realPage = 0;
    page = "1";
  }

  request.pagination = {
    realPage,
    realTake,
  };

  let intPage = Number(page);

  const nextUrl = `${process.env.APP_API_URL}${
    request.baseUrl
  }?perPage=${perPage}&page=${(intPage += 1)}`;

  response.header("Access-Control-Expose-Headers", "*");
  response.header({ page, perPage, nextUrl });

  return next();
}
