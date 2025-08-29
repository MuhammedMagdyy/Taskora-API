import { SendMailOptions } from 'nodemailer';

export interface IMailProvider {
  sendEmail(options: SendMailOptions): Promise<void>;
}
