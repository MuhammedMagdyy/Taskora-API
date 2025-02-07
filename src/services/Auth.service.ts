import { IGoogleStrategy, IUser } from '../interfaces';
import {
  userService,
  JwtService,
  HashingService,
  projectSerivce,
  taskService,
} from '../services';
import { OAuth2Client } from 'google-auth-library';
import {
  googleCallbackUrl,
  googleClientId,
  googleClientSecret,
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
  OK,
  UNAUTHORIZED,
} from '../utils';
import { Provider } from '@prisma/client';

class AuthService {
  private oAuth2Client: OAuth2Client;

  constructor() {
    this.oAuth2Client = new OAuth2Client(
      googleClientId,
      googleClientSecret,
      googleCallbackUrl
    );
  }

  async register(name: string, email: string, password: string) {
    const isUserExists = await userService.findUserByEmail(email);

    if (isUserExists) {
      throw new ApiError('User already exists', CONFLICT);
    }

    const hashedPassword = await HashingService.hash(password);
    const user = await userService.createOne({
      name,
      email,
      password: hashedPassword,
    });

    const project = await projectSerivce.createOne({
      name: DEFAULT_VALUES.PROJECTS.name,
      description: DEFAULT_VALUES.PROJECTS.description,
      userUuid: user.uuid,
      statusUuid: statusUuid,
      color: DEFAULT_VALUES.PROJECTS.color,
    });

    await taskService.createOne({
      name: DEFAULT_VALUES.TASKS.name,
      description: DEFAULT_VALUES.TASKS.description,
      userUuid: user.uuid,
      statusUuid: statusUuid,
      projectUuid: project.uuid,
    });

    const userResponse: IUser = {
      uuid: user.uuid,
      name: user.name as string,
      email: user.email,
      picture: user.picture as string,
    };

    return { data: userResponse, ...JwtService.generateTokens(user.uuid) };
  }

  async login(email: string, password: string) {
    const user = await userService.findUserByEmail(email);

    if (!user) {
      throw new ApiError('Invalid email or password', UNAUTHORIZED);
    }

    if (!user.password) {
      throw new ApiError('Invalid email or password', UNAUTHORIZED);
    }

    // TODO: When user resets password, the refresh token should be invalidated
    const isPasswordMatch = await HashingService.compare(
      password,
      user.password as string
    );

    if (!isPasswordMatch) {
      throw new ApiError('Invalid email or password', UNAUTHORIZED);
    }

    const userResponse: IUser = {
      uuid: user.uuid,
      name: user.name as string,
      email: user.email,
      picture: user.picture as string,
    };

    return { data: userResponse, ...JwtService.generateTokens(user.uuid) };
  }

  async logout(uuid: string) {
    const user = await userService.findUserByUUID(uuid);

    if (!user) {
      throw new ApiError('Unauthorized', UNAUTHORIZED);
    }

    if (user.provider === Provider.LOCAL) {
      await userService.updateOne({ uuid: user.uuid }, { refreshToken: null });
    } else {
      await this.revokeGoogleCredentials();
    }
  }

  private async revokeGoogleCredentials() {
    try {
      await this.oAuth2Client.revokeCredentials();
    } catch {
      throw new ApiError(
        'Something went wrong while revoking google credentials, please try again later...',
        INTERNAL_SERVER_ERROR
      );
    }
  }

  async getGoogleAuthUrl() {
    const authorizeUrl = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: API_INTEGRATION.GOOGLE.USER_INFO_SCOPES,
    });
    return authorizeUrl;
  }

  async getGoogleTokens(code: string) {
    const tokensResponse = await this.oAuth2Client.getToken(code);
    this.oAuth2Client.setCredentials(tokensResponse.tokens);
    return tokensResponse.tokens;
  }

  async getGoogleUserInfo() {
    const response = await this.oAuth2Client.request({
      url: API_INTEGRATION.GOOGLE.USER_INFO_URL,
    });

    if (response.status !== OK) {
      this.handleGoogleErrors(response.status);
    }

    return this.loginWithGoogle(response.data as IGoogleStrategy);
  }

  async loginWithGoogle(user: IGoogleStrategy) {
    let existingUser = await userService.findUserByEmail(user.email);

    if (!existingUser) {
      existingUser = await userService.createOne({
        name: user.name,
        email: user.email,
        provider: Provider.GOOGLE,
        providerId: user.id,
        picture: user.picture,
        isVerified: user.verified_email,
      });

      const project = await projectSerivce.createOne({
        name: DEFAULT_VALUES.PROJECTS.name,
        description: DEFAULT_VALUES.PROJECTS.description,
        userUuid: existingUser.uuid,
        statusUuid: statusUuid,
        color: DEFAULT_VALUES.PROJECTS.color,
      });

      await taskService.createOne({
        name: DEFAULT_VALUES.TASKS.name,
        description: DEFAULT_VALUES.TASKS.description,
        userUuid: existingUser.uuid,
        statusUuid: statusUuid,
        projectUuid: project.uuid,
      });
    }

    const { accessToken, refreshToken } = JwtService.generateTokens(
      existingUser.uuid
    );
    const userResponse: IUser = {
      uuid: existingUser.uuid,
      name: existingUser.name as string,
      email: existingUser.email,
      picture: existingUser.picture as string,
    };

    return { userResponse, accessToken, refreshToken };
  }

  async refreshAccessToken(token: string) {
    const payload = JwtService.verify(token, 'refresh');

    if (!payload) {
      throw new ApiError('Unauthorized', UNAUTHORIZED);
    }

    const user = await userService.findUserByUUID(payload.uuid);

    if (!user) {
      throw new ApiError('Unauthorized', UNAUTHORIZED);
    }

    return JwtService.generateAccessToken(payload);
  }

  private handleGoogleErrors(status: number) {
    switch (status) {
      case UNAUTHORIZED:
        throw new ApiError('Unauthorized', UNAUTHORIZED);
      case FORBIDDEN:
        throw new ApiError('Access denied', FORBIDDEN);
      case BAD_REQUEST:
        throw new ApiError('Bad request', BAD_REQUEST);
      default:
        throw new ApiError(
          'Something went wrong: Please try agian later...',
          INTERNAL_SERVER_ERROR
        );
    }
  }
}

export const authService = new AuthService();
