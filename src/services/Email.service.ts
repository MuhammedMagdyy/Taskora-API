import nodemailer, { Transporter } from 'nodemailer';
import { getVerifyEmailTemplate, SERVER } from '../utils';
import {
  nodeEnv,
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
      secure: nodeEnv === SERVER.PRODUCTION,
      auth: {
        user: mailAuthUser,
        pass: mailAuthPassword,
      },
    });
  }

  private async sendEmail(args: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }) {
    try {
      await this.transporter.sendMail(args);
    } catch (error) {
      console.error(error);
      throw new Error('Error sending email. Please try again later...');
    }
  }

  async sendVerifyEmail(
    email: string,
    name: string,
    token: string,
    userUuid: string
  ) {
    const verifyEmailTemplate = getVerifyEmailTemplate();
    const verifyEmailUrl = `${frontendUrl}/verify-email?token=${token}&userUuid=${userUuid}`;

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
    await this.sendEmail({
      to: email,
      subject: 'Reset your password',
      text: 'Reset your password',
      html: `<p>Hi ${name},</p>
      <p>Your OTP to reset your password is <strong>${otp}</strong></p>`,
    });
  }
}

export const emailService = new EmailService();
