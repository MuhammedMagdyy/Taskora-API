import { WORKERS } from '../utils';

export type SendEmailVerificationJob = {
  email: string;
  name: string;
  token: string;
};

export type SendForgetPasswordJob = {
  email: string;
  name: string;
  otp: string;
};

export type EmailJobData = SendEmailVerificationJob | SendForgetPasswordJob;

export type EmailJobName = (typeof WORKERS)[keyof typeof WORKERS];
