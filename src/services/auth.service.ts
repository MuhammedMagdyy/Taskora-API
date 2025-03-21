import { Provider } from '@prisma/client';
import {
  emailService,
  HashingService,
  JwtService,
  otpService,
  redisService,
  refreshTokenService,
  userService,
} from '.';
import { IUser } from '../interfaces';
import { IUserInfo } from '../types';
import {
  ApiError,
  CONFLICT,
  FORBIDDEN,
  generateCode,
  GONE,
  logger,
  MAGIC_NUMBERS,
  NOT_FOUND,
  UNAUTHORIZED,
} from '../utils';
import { BaseAuthService } from './base';

interface IAuthUserData {
  name: string;
  email: string;
  password?: string;
}
export class AuthService extends BaseAuthService {
  protected readonly provider = Provider.LOCAL;

  async register(name: string, email: string, password: string) {
    try {
      const userExists = await userService.findUserByEmail(email);

      if (userExists) {
        throw new ApiError('User already exists', CONFLICT);
      }

      const hashedPassword = await HashingService.hash(password);
      const userCredentials = { name, email, password: hashedPassword };

      const user = await this.createNewUser(userCredentials);
      const tokens = await this.generateAndStoreTokens(user.uuid);
      const userResponse = this.formatUserResponse({
        ...user,
        hasPassword: true,
      } as IUser);

      await this.sendVerificationEmail(userResponse);

      return { data: userResponse, tokens };
    } catch (error) {
      logger.error('Registration failed:', error);
      throw error;
    }
  }

  private async createNewUser(userData: IAuthUserData) {
    const { projectData, taskData } = this.createDefaultProjectAndTaskData();

    return await userService.initializeUserWithProjectAndTasks(
      userData,
      projectData,
      taskData,
    );
  }

  private async sendVerificationEmail(user: IUser) {
    const verificationToken = JwtService.generateAccessToken(
      { uuid: user.uuid },
      '24h',
    );

    await redisService.set(
      `verify-email:${user.email}`,
      verificationToken,
      MAGIC_NUMBERS.ONE_DAY_IN_SECONDS,
    );

    emailService.sendVerificationEmail(
      user.email,
      user.name,
      verificationToken,
    );
  }

  async login(email: string, password: string) {
    try {
      const user = await userService.findUserByEmail(email);

      if (!user || !user.password) {
        throw new ApiError('Invalid email or password', UNAUTHORIZED);
      }

      const passwordMatches = await HashingService.compare(
        password,
        user.password,
      );

      if (!passwordMatches) {
        throw new ApiError('Invalid email or password', UNAUTHORIZED);
      }

      if (!user.isVerified) {
        throw new ApiError(
          'Account not verified. Please check your email.',
          FORBIDDEN,
        );
      }

      const tokens = await this.generateAndStoreTokens(user.uuid);
      const userResponse = this.formatUserResponse({
        ...user,
        hasPassword: true,
      } as IUser);

      return { data: userResponse, tokens };
    } catch (error) {
      logger.error('Login failed:', error);
      throw error;
    }
  }

  async logout(refreshToken: string) {
    try {
      const storedToken =
        await refreshTokenService.refreshTokenExists(refreshToken);

      if (!storedToken) {
        throw new ApiError('Unauthorized', UNAUTHORIZED);
      }

      await refreshTokenService.deleteOne({ token: refreshToken });
    } catch (error) {
      logger.error('Logout failed:', error);
      throw error;
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = JwtService.verify(refreshToken, 'refresh');

      if (!payload) {
        throw new ApiError('Unauthorized', UNAUTHORIZED);
      }

      const user = await userService.findUserByUUID(payload.uuid as string);
      const storedToken =
        await refreshTokenService.refreshTokenExists(refreshToken);

      if (!user || !storedToken) {
        throw new ApiError('Unauthorized', UNAUTHORIZED);
      }

      await refreshTokenService.deleteOne({ token: refreshToken });
      return await this.generateAndStoreTokens(payload.uuid as string);
    } catch (error) {
      logger.error('Token refresh failed:', error);
      throw error;
    }
  }

  async verifyEmail(token: string) {
    try {
      const decoded = JwtService.verify(token, 'access');

      if (!decoded) {
        throw new ApiError('Invalid token', UNAUTHORIZED);
      }

      const user = await userService.findUserByUUID(decoded.uuid as string);

      if (!user) {
        throw new ApiError('User not found', NOT_FOUND);
      }

      const storedToken = await redisService.get<string>(
        `verify-email:${user.email}`,
      );

      if (!storedToken || storedToken !== token) {
        throw new ApiError('Verification token is invalid or expired', GONE);
      }

      await Promise.all([
        userService.updateOne({ uuid: user.uuid }, { isVerified: true }),
        redisService.delete(`verify-email:${user.email}`),
      ]);
    } catch (error) {
      logger.error('Email verification failed:', error);
      throw error;
    }
  }

  async resendVerificationEmail(email: string) {
    try {
      const user = await userService.findUserByEmail(email);

      if (!user) {
        throw new ApiError('User not found', NOT_FOUND);
      }

      if (user.isVerified) {
        throw new ApiError('Email already verified', CONFLICT);
      }

      const isTokenExists = await redisService.exists(`verify-email:${email}`);
      if (isTokenExists) {
        await redisService.delete(`verify-email:${email}`);
      }

      const userResponse = this.formatUserResponse({
        ...user,
        hasPassword: user.password ? true : false,
      } as IUser);
      await this.sendVerificationEmail(userResponse);
    } catch (error) {
      logger.error('Resend verification email failed:', error);
      throw error;
    }
  }

  async generateOTP(email: string) {
    try {
      const user = await userService.findUserByEmail(email);

      if (user) {
        const otp = generateCode();
        await this.storeAndSendOTP(user as IUserInfo, otp);
      }
    } catch (error) {
      logger.error('OTP generation failed:', error);
      throw error;
    }
  }

  private async storeAndSendOTP(user: IUserInfo, otp: string) {
    await Promise.all([
      otpService.createOne({
        otp,
        userUuid: user.uuid,
        expiresAt: new Date(
          Date.now() + MAGIC_NUMBERS.FIFTEEN_MINUTES_IN_MILLISECONDS,
        ),
      }),
      redisService.set(
        `otp:${otp}`,
        otp,
        MAGIC_NUMBERS.FIFTEEN_MINUTES_IN_SECONDS,
      ),
    ]);

    emailService.sendForgetPasswordEmail(user.email, user.name, otp);
  }

  async verifyOTP(email: string, password: string, otp: string) {
    try {
      const user = await userService.findUserByEmail(email);

      if (!user) {
        throw new ApiError('User not found', NOT_FOUND);
      }

      const storedOTP = await redisService.get<string>(`otp:${otp}`);

      if (!storedOTP || String(storedOTP).trim() !== String(otp).trim()) {
        throw new ApiError('Invalid or expired OTP', GONE);
      }

      await this.resetPassword(user.uuid, password, otp);
    } catch (error) {
      logger.error('OTP verification failed:', error);
      throw error;
    }
  }

  private async resetPassword(userUuid: string, password: string, otp: string) {
    const hashedPassword = await HashingService.hash(password);

    await Promise.all([
      redisService.delete(`otp:${otp}`),
      userService.updateOne({ uuid: userUuid }, { password: hashedPassword }),
      refreshTokenService.deleteMany({ userUuid }),
    ]);
  }
}

export const authService = new AuthService();
