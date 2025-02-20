import { IGitHubOAuthClient, IGitHubStrategy, IUser } from '../interfaces';
import { userService } from '../services';
import { BaseAuthService } from './base';
import {
  githubClientId,
  githubClientSecret,
  githubCallbackUrl,
  statusUuid,
} from '../config';
import { Provider } from '@prisma/client';
import {
  API_INTEGRATION,
  ApiError,
  BAD_REQUEST,
  CONFLICT,
  logger,
  NOT_FOUND,
  UNAUTHORIZED,
} from '../utils';
import axios, { AxiosError } from 'axios';
import { HttpExceptionStatusCodes } from '../types';

export class GithubService extends BaseAuthService {
  private readonly githubConfig: IGitHubOAuthClient;
  protected readonly provider = Provider.GITHUB;

  constructor() {
    super();

    this.githubConfig = {
      clientId: githubClientId,
      clientSecret: githubClientSecret,
      callbackUrl: githubCallbackUrl,
    };
  }

  private validateGithubConfig() {
    if (
      !this.githubConfig.clientId ||
      !this.githubConfig.clientSecret ||
      !this.githubConfig.callbackUrl
    ) {
      throw new ApiError('Invalid GitHub configuration', BAD_REQUEST);
    }
  }

  async loginWithGitHub(user: IGitHubStrategy) {
    try {
      let userExists = await userService.findUserByEmail(user.email);

      if (userExists?.email && !userExists?.githubId) {
        throw new ApiError(
          'Account exists. Please link your GitHub account',
          CONFLICT
        );
      }

      if (!userExists) {
        userExists = await this.createNewUser(user);
      }

      const tokens = await this.generateAndStoreTokens(userExists.uuid);
      const userResponse = this.formatUserResponse(userExists as IUser);

      return { userResponse, tokens };
    } catch (error) {
      logger.error('Login with GitHub failed:', error);
      throw error;
    }
  }

  private async createNewUser(user: IGitHubStrategy) {
    const gitUserProfile = {
      name: user.name,
      email: user.email,
      provider: Provider.GITHUB,
      githubId: user.id.toString(),
      picture: user.avatar_url,
      isVerified: user.verified,
    };

    const { projectData, taskData } =
      this.createDefaultProjectAndTaskData(statusUuid);

    return await userService.initializeUserWithProjectAndTasks(
      gitUserProfile,
      projectData,
      taskData
    );
  }

  async getGitHubUserInfo(token: string) {
    try {
      if (!token) {
        throw new ApiError('Missing access token', BAD_REQUEST);
      }

      const [userInfo, userEmails] = await Promise.all([
        this.fetchGitHubUserInfo(token),
        this.fetchGitHubUserEmails(token),
      ]);

      const primaryEmail = userEmails.data.find(
        (email: { primary: boolean }) => email.primary || userEmails.data[0]
      );

      if (!primaryEmail) {
        throw new ApiError('Primary email not found', NOT_FOUND);
      }

      return this.loginWithGitHub({
        id: userInfo.data.id,
        provider: Provider.GITHUB,
        email: primaryEmail.email,
        verified: primaryEmail.verified,
        name: userInfo.data.name,
        avatar_url: userInfo.data.avatar_url,
      });
    } catch (error) {
      this.handleGitHubApiError(error);
    }
  }

  private async fetchGitHubUserInfo(token: string) {
    return axios.get(API_INTEGRATION.GITHUB.USER_INFO_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private async fetchGitHubUserEmails(token: string) {
    return axios.get(API_INTEGRATION.GITHUB.EMAILS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getGitHubAccessToken(code: string) {
    try {
      this.validateGithubConfig();

      if (!code) {
        throw new ApiError('Missing authorization code', BAD_REQUEST);
      }

      const response = await axios.post(
        API_INTEGRATION.GITHUB.TOKEN_URL,
        {
          client_id: this.githubConfig.clientId,
          client_secret: this.githubConfig.clientSecret,
          code,
          redirect_uri: this.githubConfig.callbackUrl,
        },
        { headers: { Accept: 'application/json' } }
      );

      if (!response.data.access_token) {
        throw new ApiError('GitHub token exchange failed', UNAUTHORIZED);
      }

      return response.data.access_token;
    } catch (error) {
      this.handleGitHubApiError(error);
    }
  }

  private handleGitHubApiError(error: unknown) {
    if (error instanceof AxiosError) {
      logger.error('GitHub API Error:', error.response?.data);
      throw new ApiError(
        `GitHub API Error: ${error.response?.data?.message || error.message}`,
        (error.response?.status as HttpExceptionStatusCodes) || UNAUTHORIZED
      );
    }
  }
}

export const githubService = new GithubService();
