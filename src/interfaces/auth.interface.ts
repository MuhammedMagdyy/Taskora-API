export interface IAuth {
  name?: string;
  email: string;
  password: string;
}

export interface IVerifyOtp {
  email: string;
  password: string;
  otp: string;
}

export interface IResetPassword {
  userUuid: string;
  password: string;
  otp: string;
}
