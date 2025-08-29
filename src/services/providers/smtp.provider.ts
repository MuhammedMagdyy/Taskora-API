import * as nodemailer from 'nodemailer';
import {
  mailAuthPassword,
  mailAuthUser,
  mailPort,
  mailService,
} from '../../config';
import { IMailProvider } from '../../interfaces';

export class SmtpMailProvider implements IMailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: mailService,
      host: mailService,
      port: Number(mailPort),
      secure: false,
      auth: { user: mailAuthUser, pass: mailAuthPassword },
      requireTLS: true,
    });
  }

  async sendEmail(options: nodemailer.SendMailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: `Taskora support <${mailAuthUser}>`,
      ...options,
    });
  }
}

export const smtpMailProvider = new SmtpMailProvider();
