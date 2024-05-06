import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import { ConfigService } from '@nestjs/config';
import { CustomError } from '../helpers/exceptions';
import { verifyUserTemplate } from 'src/utils/mail-template/verify-email.template';
interface IMailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  public async sendMailLocal(
    mailOptions: Mail.Options,
  ): Promise<nodemailer.SentMessageInfo> {
    try {
      const transport = nodemailer.createTransport(
        smtpTransport({
          host: this.configService.get<string>('EMAIL_HOST'),
          port: this.configService.get<string>('EMAIL_PORT'),
          auth: {
            user: this.configService.get<string>('EMAIL_USERNAME'),
            pass: this.configService.get<string>('EMAIL_PASSWORD'),
          },
        }),
      );

      return await transport.sendMail(mailOptions);
    } catch (error) {
      return new BadRequestException('Something went wrong!');
    }
  }

  async sendMail(mailOptions: IMailOptions, cb: any) {
    const mailOption = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
    };

    this.sendMailLocal(mailOption)
      .then(() => {
        console.log('Email sent successfully local');
        cb(null);
      })
      .catch((error) => {
        console.log('Error while sending email local:', error);
        cb(error);
      });
  }

  async loginInfoMail(password: string, email: string, subject: string) {
    try {
      const mailOptions = {
        to: email,
        subject: subject,
        html: verifyUserTemplate(password),
      };
      await this.sendMail(mailOptions, (error: any) => {
        if (error) {
          throw CustomError.customException(
            error.message,
            error.statusCode ?? HttpStatus.BAD_REQUEST,
          );
        }
      });
    } catch (error) {
      throw CustomError.customException(
        error.message,
        error.statusCode ?? HttpStatus.BAD_REQUEST,
      );
    }
  }
}
