import nodemailer from "nodemailer";
import path from "path";
import AppError from "../../errors/AppError";
import hbs from "nodemailer-express-handlebars";

interface Request {
  email: string;
  allTimeRevenue: number;
  allTimeAverage: number;
  name: string;
}

export default class SendReportEmailService {
  public async execute({
    allTimeAverage,
    allTimeRevenue,
    email,
    name,
  }: Request): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "0f096872baa83c",
        pass: "0535450bedc394",
      },
    });

    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          partialsDir: path.resolve(__dirname, "..", "..", "views"),
          defaultLayout: undefined,
        },
        viewPath: path.resolve(__dirname, "..", "..", "views"),
      })
    );

    const mailOptions = {
      from: "nao-responda@kenzie-burger.com.br",
      to: email,
      subject: "Solicitação de relatório de vendas",
      template: "report",
      context: {
        name,
        allTimeAverage: Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(allTimeAverage),
        allTimeRevenue: Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(allTimeRevenue),
      },
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw new AppError("Error while sending the email", 500);
      }

      console.log(info);
    });
  }
}
