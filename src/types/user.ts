import { IUser } from '../interfaces';

export type IUserInfo = Pick<IUser, 'uuid' | 'name' | 'email'>;
