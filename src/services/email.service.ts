import { frontendUrl } from '../config';
import { IMailProvider } from '../interfaces';
import {
  getOTPTemplate,
  getVerifyEmailTemplate,
  getWinnersTemplate,
  logger,
} from '../utils';
import { smtpMailProvider } from './providers';

export class EmailService {
  constructor(private readonly mailProvider: IMailProvider) {}

  async sendVerificationEmail(email: string, name: string, token: string) {
    try {
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

      logger.info(`Verification email sent to ${email}`);
    } catch (error) {
      logger.error(`Failed to send verification email: ${error}`);
      throw error;
    }
  }

  async sendForgetPasswordEmail(email: string, name: string, otp: string) {
    try {
      const html = getOTPTemplate()
        .replace(/{{otp}}/g, otp)
        .replace(/{{name}}/g, name);

      await this.mailProvider.sendEmail({
        to: email,
        subject: 'Reset your password',
        text: 'Reset your password',
        html,
      });

      logger.info(`Forget password email sent to ${email}`);
    } catch (error) {
      logger.error(`Failed to send forget password email: ${error}`);
      throw error;
    }
  }

  async notifyWinnerViaEmail(email: string, name: string) {
    try {
      const html = getWinnersTemplate().replace(/{{name}}/g, name);

      await this.mailProvider.sendEmail({
        to: email,
        subject: 'Congratulations! You are a winner',
        text: 'Congratulations! You are a winner',
        html,
      });

      logger.info(`Winner notification email sent to ${email}`);
    } catch (error) {
      logger.error(`Failed to send winner notification email: ${error}`);
      throw error;
    }
  }
}

export const emailService = new EmailService(smtpMailProvider);
