import { Provider } from '@prisma/client';
import { AxiosError } from 'axios';
import { OAuth2Client } from 'google-auth-library';
import { userService } from '.';
import {
  googleCallbackUrl,
  googleClientId,
  googleClientSecret,
} from '../config';
import { IGoogleOAuthClient, IGoogleStrategy, IUser } from '../interfaces';
import { HttpExceptionStatusCodes } from '../types';
import {
  API_INTEGRATION,
  ApiError,
  BAD_REQUEST,
  CONFLICT,
  logger,
  OK,
  UNAUTHORIZED,
} from '../utils';
import { BaseAuthService } from './base';

export class GoogleService extends BaseAuthService {
  private readonly googleConfig: IGoogleOAuthClient;
  private readonly googleOAuth2Client: OAuth2Client;
  protected readonly provider = Provider.GOOGLE;

  constructor() {
    super();

    this.googleConfig = {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      callbackUrl: googleCallbackUrl,
    };

    this.googleOAuth2Client = new OAuth2Client(
      this.googleConfig.clientId,
      this.googleConfig.clientSecret,
      this.googleConfig.callbackUrl,
    );
  }

  private validateGoogleConfig() {
    if (
      !this.googleConfig.clientId ||
      !this.googleConfig.clientSecret ||
      !this.googleConfig.callbackUrl
    ) {
      throw new ApiError('Invalid Google configuration', BAD_REQUEST);
    }
  }

  async loginWithGoogle(user: IGoogleStrategy) {
    try {
      let userExists = await userService.findUserByEmail(user.email);

      if (userExists?.email && !userExists?.googleId) {
        throw new ApiError(
          'Account exists. Please link your Google account',
          CONFLICT,
        );
      }

      if (!userExists) {
        userExists = await this.createNewUser(user);
      }

      const tokens = await this.generateAndStoreTokens(userExists.uuid);
      const userResponse = this.formatUserResponse({
        ...userExists,
        hasPassword: userExists.password ? true : false,
      } as IUser);

      return { userResponse, tokens };
    } catch (error) {
      logger.error('Login with Google failed:', error);
      throw error;
    }
  }

  private async createNewUser(user: IGoogleStrategy) {
    const googleUserProfile = {
      name: user.name,
      email: user.email,
      provider: Provider.GOOGLE,
      googleId: user.id,
      picture: user.picture,
      isVerified: user.verified_email,
    };

    const { projectData, taskData } = this.createDefaultProjectAndTaskData();

    return await userService.initializeUserWithProjectAndTasks(
      googleUserProfile,
      projectData,
      taskData,
    );
  }

  async getGoogleUserInfo(token: string) {
    try {
      if (!token) {
        throw new ApiError('Missing access token', BAD_REQUEST);
      }

      this.googleOAuth2Client.setCredentials({ access_token: token });

      const response = await this.googleOAuth2Client.request({
        url: API_INTEGRATION.GOOGLE.USER_INFO_URL,
      });

      if (response.status !== OK) {
        throw new ApiError(
          'Failed to fetch user info',
          response.status as HttpExceptionStatusCodes,
        );
      }

      return this.loginWithGoogle(response.data as IGoogleStrategy);
    } catch (error) {
      this.handleGoogleApiError(error);
    }
  }

  getGoogleAuthUrl() {
    try {
      this.validateGoogleConfig();

      return this.googleOAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: API_INTEGRATION.GOOGLE.USER_INFO_SCOPES,
      });
    } catch (error) {
      this.handleGoogleApiError(error);
    }
  }

  async getGoogleAccessToken(code: string) {
    try {
      this.validateGoogleConfig();

      if (!code) {
        throw new ApiError('Missing authorization code', BAD_REQUEST);
      }

      const { tokens } = await this.googleOAuth2Client.getToken(code);

      if (!tokens.access_token) {
        throw new ApiError('Google token exchange failed', UNAUTHORIZED);
      }

      this.googleOAuth2Client.setCredentials(tokens);

      return tokens.access_token;
    } catch (error) {
      this.handleGoogleApiError(error);
    }
  }

  private handleGoogleApiError(error: unknown) {
    if (error instanceof AxiosError) {
      logger.error('Google API Error:', error.response?.data);
      throw new ApiError(
        `Google API Error: ${error.response?.data?.message || error.message}`,
        (error.response?.status as HttpExceptionStatusCodes) || UNAUTHORIZED,
      );
    }
    if (error instanceof Error) {
      logger.error('Google OAuth Error:', error);
      throw new ApiError(`Google OAuth Error: ${error.message}`, UNAUTHORIZED);
    }
    throw error;
  }
}

export const googleService = new GoogleService();
