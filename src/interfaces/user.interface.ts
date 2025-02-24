export interface IUser {
  uuid: string;
  name: string;
  email: string;
  isVerified: boolean;
  picture: string;
  hasPassword: boolean;
  createdAt: Date;
}
