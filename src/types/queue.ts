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

export type EmailJobName =
  | 'SEND_VERIFICATION_EMAIL'
  | 'SEND_FORGET_PASSWORD_EMAIL';
