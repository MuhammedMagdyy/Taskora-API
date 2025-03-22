import { Secret, sign, verify } from 'jsonwebtoken';
import {
  accessTokenExpiry,
  accessTokenSecret,
  refreshTokenExpiry,
  refreshTokenSecret,
} from '../config';
import { IJwtPayload } from '../interfaces';
import { JwtType } from '../types';

export class JwtService {
  static generateAccessToken(
    { exp: _exp, iat: _iat, ...payload }: IJwtPayload,
    expiresIn = accessTokenExpiry,
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
