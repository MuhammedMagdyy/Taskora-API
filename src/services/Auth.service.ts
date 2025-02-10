import { IGitHubStrategy, IGoogleStrategy, IUser } from '../interfaces';
import {
  userService,
  JwtService,
  HashingService,
  projectSerivce,
  taskService,
  refreshTokenService,
} from '../services';
import { OAuth2Client } from 'google-auth-library';
import {
  googleCallbackUrl,
  googleClientId,
  googleClientSecret,
  githubClientId,
  githubClientSecret,
  githubCallbackUrl,
  statusUuid,
} from '../config';
import {
  API_INTEGRATION,
  ApiError,
  BAD_REQUEST,
  CONFLICT,
  DEFAULT_VALUES,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  MAGIC_NUMBERS,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from '../utils';
import { Provider } from '@prisma/client';
import axios from 'axios';

class AuthService {
  private googleOAuth2Client: OAuth2Client;
  private githubOAuth2Client: {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
  };

  constructor() {
    this.googleOAuth2Client = new OAuth2Client(
      googleClientId,
      googleClientSecret,
      googleCallbackUrl
    );
    this.githubOAuth2Client = {
      clientId: githubClientId,
      clientSecret: githubClientSecret,
      callbackUrl: githubCallbackUrl,
    };
  }

  async register(name: string, email: string, password: string) {
    const userExists = await userService.findUserByEmail(email);

    if (userExists) {
      throw new ApiError('User already exists', CONFLICT);
    }

    const hashedPassword = await HashingService.hash(password);
    const user = await userService.createOne({
      name,
      email,
      password: hashedPassword,
    });

    const project = await this.handleCreateUserProject(user as IUser);
    await this.handleCreateUserTask(user as IUser, project.uuid);

    const tokens = JwtService.generateTokens(user.uuid);
    await refreshTokenService.createOne({
      token: tokens.refreshToken,
      userUuid: user.uuid,
      expiresAt: new Date(Date.now() + MAGIC_NUMBERS.ONE_WEEK),
    });

    const userResponse: IUser = {
      uuid: user.uuid,
      name: user.name as string,
      email: user.email,
      picture: user.picture as string,
      createdAt: user.createdAt,
    };

    return { data: userResponse, tokens };
  }

  async login(email: string, password: string) {
    const userExists = await userService.findUserByEmail(email);

    if (!userExists || !userExists.password) {
      throw new ApiError('Invalid email or password', UNAUTHORIZED);
    }

    // TODO: When user resets password, the refresh token should be invalidated
    const passwordMatches = await HashingService.compare(
      password,
      userExists.password as string
    );

    if (!passwordMatches) {
      throw new ApiError('Invalid email or password', UNAUTHORIZED);
    }

    const tokens = JwtService.generateTokens(userExists.uuid);
    await refreshTokenService.createOne({
      token: tokens.refreshToken,
      userUuid: userExists.uuid,
      expiresAt: new Date(Date.now() + MAGIC_NUMBERS.ONE_WEEK),
    });

    const userResponse: IUser = {
      uuid: userExists.uuid,
      name: userExists.name as string,
      email: userExists.email,
      picture: userExists.picture as string,
      createdAt: userExists.createdAt,
    };

    return { data: userResponse, tokens };
  }

  async logout(refreshToken: string) {
    const storedToken =
      await refreshTokenService.refreshTokenExists(refreshToken);

    if (!storedToken) {
      throw new ApiError('Unauthorized', UNAUTHORIZED);
    }

    await refreshTokenService.deleteOne({ token: refreshToken });
  }

  async getGoogleAuthUrl() {
    const authorizeUrl = this.googleOAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: API_INTEGRATION.GOOGLE.USER_INFO_SCOPES,
    });
    return authorizeUrl;
  }

  async getGoogleTokens(code: string) {
    const tokensResponse = await this.googleOAuth2Client.getToken(code);
    this.googleOAuth2Client.setCredentials(tokensResponse.tokens);
    return tokensResponse.tokens;
  }

  async getGoogleUserInfo() {
    const response = await this.googleOAuth2Client.request({
      url: API_INTEGRATION.GOOGLE.USER_INFO_URL,
    });

    if (response.status !== OK) {
      this.handleAxiosResponseErrors(response.status);
    }

    return this.loginWithGoogle(response.data as IGoogleStrategy);
  }

  async loginWithGoogle(user: IGoogleStrategy) {
    let userExists = await userService.findUserByEmail(user.email);

    if (!userExists) {
      userExists = await userService.createOne({
        name: user.name,
        email: user.email,
        provider: Provider.GOOGLE,
        providerId: user.id,
        picture: user.picture,
        isVerified: user.verified_email,
      });

      const project = await this.handleCreateUserProject(userExists as IUser);
      await this.handleCreateUserTask(userExists as IUser, project.uuid);
    }

    const tokens = JwtService.generateTokens(userExists.uuid);
    await refreshTokenService.createOne({
      token: tokens.refreshToken,
      userUuid: userExists.uuid,
      expiresAt: new Date(Date.now() + MAGIC_NUMBERS.ONE_WEEK),
    });

    const userResponse: IUser = {
      uuid: userExists.uuid,
      name: userExists.name as string,
      email: userExists.email,
      picture: userExists.picture as string,
      createdAt: userExists.createdAt,
    };

    return { userResponse, tokens };
  }

  async loginWithGitHub(user: IGitHubStrategy) {
    let userExists = await userService.findUserByEmail(user.email);

    if (!userExists) {
      userExists = await userService.createOne({
        name: user.name,
        email: user.email,
        provider: Provider.GITHUB,
        providerId: user.id.toString(),
        picture: user.avatar_url,
        isVerified: user.verified,
      });

      const project = await this.handleCreateUserProject(userExists as IUser);
      await this.handleCreateUserTask(userExists as IUser, project.uuid);
    }

    const tokens = JwtService.generateTokens(userExists.uuid);
    await refreshTokenService.createOne({
      token: tokens.refreshToken,
      userUuid: userExists.uuid,
      expiresAt: new Date(Date.now() + MAGIC_NUMBERS.ONE_WEEK),
    });

    const userResponse: IUser = {
      uuid: userExists.uuid,
      name: userExists.name as string,
      email: userExists.email,
      picture: userExists.picture as string,
      createdAt: userExists.createdAt,
    };

    return { userResponse, tokens };
  }

  async getGitHubUserInfo(token: string) {
    const userInfo = await axios.get(API_INTEGRATION.GITHUB.USER_INFO_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userEmails = await axios.get(API_INTEGRATION.GITHUB.EMAILS_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (userInfo.status !== OK || userEmails.status !== OK) {
      this.handleAxiosResponseErrors(userInfo.status);
    }

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
  }

  async getGitHubAccessToken(code: string) {
    if (!code) {
      throw new ApiError('Missing code', BAD_REQUEST);
    }

    const response = await axios.post(
      API_INTEGRATION.GITHUB.TOKEN_URL,
      {
        client_id: this.githubOAuth2Client.clientId,
        client_secret: this.githubOAuth2Client.clientSecret,
        code,
        redirect_uri: this.githubOAuth2Client.callbackUrl,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    if (response.status !== OK || !response.data.access_token) {
      throw new ApiError(
        `GitHub token exchange failed: ${response.data.error || 'Unknown error'}`,
        UNAUTHORIZED
      );
    }

    return response.data.access_token;
  }

  async refreshAccessToken(refreshToken: string) {
    const payload = JwtService.verify(refreshToken, 'refresh');

    if (!payload) {
      throw new ApiError('Unauthorized', UNAUTHORIZED);
    }

    const user = await userService.findUserByUUID(payload.uuid);

    if (!user) {
      throw new ApiError('Unauthorized', UNAUTHORIZED);
    }

    const storedToken =
      await refreshTokenService.refreshTokenExists(refreshToken);

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new ApiError('Unauthorized', UNAUTHORIZED);
    }

    const tokens = JwtService.generateTokens(payload.uuid);

    await refreshTokenService.deleteOne({ token: refreshToken });
    await refreshTokenService.createOne({
      token: tokens.refreshToken,
      userUuid: payload.uuid,
      expiresAt: new Date(Date.now() + MAGIC_NUMBERS.ONE_WEEK),
    });

    return tokens;
  }

  private handleAxiosResponseErrors(status: number) {
    switch (status) {
      case UNAUTHORIZED:
        throw new ApiError('Unauthorized', UNAUTHORIZED);
      case FORBIDDEN:
        throw new ApiError('Access denied', FORBIDDEN);
      case BAD_REQUEST:
        throw new ApiError('Bad request', BAD_REQUEST);
      case NOT_FOUND:
        throw new ApiError('Not found', NOT_FOUND);
      default:
        throw new ApiError(
          'Something went wrong: Please try agian later...',
          INTERNAL_SERVER_ERROR
        );
    }
  }

  private async handleCreateUserProject(user: IUser) {
    return await projectSerivce.createOne({
      name: DEFAULT_VALUES.PROJECTS.name,
      description: DEFAULT_VALUES.PROJECTS.description,
      userUuid: user.uuid,
      statusUuid: statusUuid,
      color: DEFAULT_VALUES.PROJECTS.color,
    });
  }

  private async handleCreateUserTask(user: IUser, projectUuid: string) {
    return await taskService.createOne({
      name: DEFAULT_VALUES.TASKS.name,
      description: DEFAULT_VALUES.TASKS.description,
      userUuid: user.uuid,
      statusUuid: statusUuid,
      projectUuid,
    });
  }
}

export const authService = new AuthService();
