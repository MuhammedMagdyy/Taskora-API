import { sign, verify, Secret } from 'jsonwebtoken';
import {
  accessTokenSecret,
  refreshTokenSecret,
  accessTokenExpiry,
  refreshTokenExpiry,
} from '../config';
import { JwtType } from '../types';
import { IJwtPayload } from '../interfaces';

export class JwtService {
  static generateAccessToken(
    { exp: _exp, iat: _iat, ...payload }: IJwtPayload,
    expiresIn = accessTokenExpiry
  ) {
    return sign(payload, accessTokenSecret as Secret, {
      expiresIn,
    });
  }

  static generateRefreshToken({
    exp: _exp,
    iat: _iat,
    ...payload
  }: IJwtPayload) {
    return sign(payload, refreshTokenSecret as Secret, {
      expiresIn: refreshTokenExpiry,
    });
  }

  static generateTokens(uuid: string) {
    const payload: IJwtPayload = { uuid };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  static verify(token: string, type: JwtType): IJwtPayload {
    const secret = type === 'access' ? accessTokenSecret : refreshTokenSecret;

    return verify(token, secret as Secret) as IJwtPayload;
  }
}
