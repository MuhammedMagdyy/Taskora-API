import nodemailer, { Transporter } from 'nodemailer';
import { getVerifyEmailTemplate, getOTPTemplate, logger } from '../utils';
import {
  frontendUrl,
  mailService,
  mailHost,
  mailPort,
  mailAuthUser,
  mailAuthPassword,
} from '../config';

export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: mailService,
      host: mailHost,
      port: Number(mailPort),
      secure: false,
      auth: {
        user: mailAuthUser,
        pass: mailAuthPassword,
      },
      requireTLS: true,
    });
  }

  private async sendEmail(args: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }) {
    try {
      await this.transporter.sendMail({
        from: `Taskora support <${mailAuthUser}>`,
        to: args.to,
        subject: args.subject,
        text: args.text,
        html: args.html,
      });
    } catch (error) {
      logger.error(`Error sending email - ${error} ❌`);
      throw new Error('Error sending email. Please try again later...');
    }
  }

  async sendVerificationEmail(email: string, name: string, token: string) {
    const verifyEmailTemplate = getVerifyEmailTemplate();
    const verifyEmailUrl = `${frontendUrl}/verify-email?token=${token}`;

    const html = verifyEmailTemplate
      .replace(/{{verifyEmailUrl}}/g, verifyEmailUrl)
      .replace(/{{name}}/g, name);

    await this.sendEmail({
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

    await this.sendEmail({
      to: email,
      subject: 'Reset your password',
      text: 'Reset your password',
      html,
    });
  }
}

export const emailService = new EmailService();
