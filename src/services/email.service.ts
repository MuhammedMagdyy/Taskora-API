import { frontendUrl } from '../config';
import { IMailProvider } from '../interfaces';
import {
  getOTPTemplate,
  getVerifyEmailTemplate,
  getWinnersTemplate,
} from '../utils';
import { smtpMailProvider } from './providers';

export class EmailService {
  constructor(private readonly mailProvider: IMailProvider) {}

  async sendVerificationEmail(email: string, name: string, token: string) {
    const verifyEmailTemplate = getVerifyEmailTemplate();
    const verifyEmailUrl = `${frontendUrl}/verify-email?token=${token}`;

    const html = verifyEmailTemplate
      .replace(/{{verifyEmailUrl}}/g, verifyEmailUrl)
      .replace(/{{name}}/g, name);

    await this.mailProvider.sendEmail({
      to: email,
      subject: 'Verify your email',
      text: 'Verify your email',
      html,
    });
  }

  async sendForgetPasswordEmail(email: string, name: string, otp: string) {
    const html = getOTPTemplate()
      .replace(/{{otp}}/g, otp)
      .replace(/{{name}}/g, name);

    await this.mailProvider.sendEmail({
      to: email,
      subject: 'Reset your password',
      text: 'Reset your password',
      html,
    });
  }

  async sendNotifyWinnerEmail(email: string, name: string) {
    const html = getWinnersTemplate().replace(/{{name}}/g, name);

    await this.mailProvider.sendEmail({
      to: email,
      subject: 'Congratulations! You are a winner',
      text: 'Congratulations! You are a winner',
      html,
    });
  }
}

export const emailService = new EmailService(smtpMailProvider);
