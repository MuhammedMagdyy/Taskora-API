import { IGitHubStrategy, IGoogleStrategy, IUser } from '../interfaces';
import {
  userService,
  JwtService,
  HashingService,
  refreshTokenService,
  emailService,
  redisService,
  otpService,
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
  GONE,
  INTERNAL_SERVER_ERROR,
  MAGIC_NUMBERS,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from '../utils';
import { Provider } from '@prisma/client';
import axios from 'axios';
import crypto from 'crypto';
import { generateCode } from '../utils';

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

    const user = await userService.initializeUserWithProjectAndTasks(
      { name, email, password: hashedPassword },
      {
        name: DEFAULT_VALUES.PROJECTS.name,
        description: DEFAULT_VALUES.PROJECTS.description,
        color: DEFAULT_VALUES.PROJECTS.color,
        statusUuid,
      },
      {
        name: DEFAULT_VALUES.TASKS.name,
        description: DEFAULT_VALUES.TASKS.description,
        statusUuid,
      }
    );

    const tokens = JwtService.generateTokens(user.uuid);
    await refreshTokenService.createOne({
      token: tokens.refreshToken,
      userUuid: user.uuid,
      expiresAt: new Date(Date.now() + MAGIC_NUMBERS.ONE_WEEK_IN_MILLISECONDS),
    });

    const userResponse: IUser = {
      uuid: user.uuid,
      name: user.name as string,
      email: user.email,
      isVerified: user.isVerified,
      picture: user.picture as string,
      createdAt: user.createdAt,
    };

    const verificationToken = crypto
      .randomBytes(MAGIC_NUMBERS.NUMBER_OF_BYTES)
      .toString('hex');

    await redisService.set(
      `verify-email:${verificationToken}`,
      verificationToken,
      MAGIC_NUMBERS.ONE_DAY_IN_SECONDS
    );

    emailService.sendVerificationEmail(email, name, verificationToken);

    return { data: userResponse, tokens };
  }

  async login(email: string, password: string) {
    const userExists = await userService.findUserByEmail(email);

    if (!userExists || !userExists.password) {
      throw new ApiError('Invalid email or password', UNAUTHORIZED);
    }

    const passwordMatches = await HashingService.compare(
      password,
      userExists.password as string
    );

    if (!passwordMatches) {
      throw new ApiError('Invalid email or password', UNAUTHORIZED);
    }

    if (!userExists.isVerified) {
      throw new ApiError(
        'Account not verified. Please check your email.',
        FORBIDDEN
      );
    }

    const tokens = JwtService.generateTokens(userExists.uuid);
    await refreshTokenService.createOne({
      token: tokens.refreshToken,
      userUuid: userExists.uuid,
      expiresAt: new Date(Date.now() + MAGIC_NUMBERS.ONE_WEEK_IN_MILLISECONDS),
    });

    const userResponse: IUser = {
      uuid: userExists.uuid,
      name: userExists.name as string,
      email: userExists.email,
      isVerified: userExists.isVerified,
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
    console.log(tokensResponse);
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

    if (userExists?.email && !userExists?.googleId) {
      throw new ApiError(
        'You have an account, please link your Google account',
        CONFLICT
      );
    }

    if (!userExists?.email && !userExists?.password) {
      userExists = await userService.createOne({
        name: user.name,
        email: user.email,
        provider: Provider.GOOGLE,
        googleId: user.id,
        picture: user.picture,
        isVerified: user.verified_email,
      });

      const projectData = {
        name: DEFAULT_VALUES.PROJECTS.name,
        description: DEFAULT_VALUES.PROJECTS.description,
        color: DEFAULT_VALUES.PROJECTS.color,
        statusUuid,
      };

      const taskData = {
        name: DEFAULT_VALUES.TASKS.name,
        description: DEFAULT_VALUES.TASKS.description,
        statusUuid,
      };

      await userService.initializeUserWithProjectAndTasks(
        { name: userExists.name, email: userExists.email },
        projectData,
        taskData
      );
    }

    const tokens = JwtService.generateTokens(userExists.uuid);
    await refreshTokenService.createOne({
      token: tokens.refreshToken,
      userUuid: userExists.uuid,
      expiresAt: new Date(Date.now() + MAGIC_NUMBERS.ONE_WEEK_IN_MILLISECONDS),
    });

    const userResponse: IUser = {
      uuid: userExists.uuid,
      name: userExists.name as string,
      email: userExists.email,
      isVerified: userExists.isVerified,
      picture: userExists.picture as string,
      createdAt: userExists.createdAt,
    };

    return { userResponse, tokens };
  }

  async loginWithGitHub(user: IGitHubStrategy) {
    let userExists = await userService.findUserByEmail(user.email);

    if (userExists?.email && !userExists?.githubId) {
      throw new ApiError(
        'You have an account, please link you Github account',
        CONFLICT
      );
    }

    if (!userExists?.email && !userExists?.password) {
      userExists = await userService.createOne({
        name: user.name,
        email: user.email,
        provider: Provider.GITHUB,
        githubId: user.id.toString(),
        picture: user.avatar_url,
        isVerified: user.verified,
      });

      const projectData = {
        name: DEFAULT_VALUES.PROJECTS.name,
        description: DEFAULT_VALUES.PROJECTS.description,
        color: DEFAULT_VALUES.PROJECTS.color,
        statusUuid,
      };

      const taskData = {
        name: DEFAULT_VALUES.TASKS.name,
        description: DEFAULT_VALUES.TASKS.description,
        statusUuid,
      };

      await userService.initializeUserWithProjectAndTasks(
        { name: userExists.name, email: userExists.email },
        projectData,
        taskData
      );
    }

    const tokens = JwtService.generateTokens(userExists.uuid);
    await refreshTokenService.createOne({
      token: tokens.refreshToken,
      userUuid: userExists.uuid,
      expiresAt: new Date(Date.now() + MAGIC_NUMBERS.ONE_WEEK_IN_MILLISECONDS),
    });

    const userResponse: IUser = {
      uuid: userExists.uuid,
      name: userExists.name as string,
      email: userExists.email,
      isVerified: userExists.isVerified,
      picture: userExists.picture as string,
      createdAt: userExists.createdAt,
    };

    return { userResponse, tokens };
  }

  async getGitHubUserInfo(token: string) {
    const userInfo = await axios.get(API_INTEGRATION.GITHUB.USER_INFO_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(userInfo.data);

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

    console.log(response.data);

    return response.data.access_token;
  }

  async refreshAccessToken(refreshToken: string) {
    const payload = JwtService.verify(refreshToken, 'refresh');

    if (!payload) {
      throw new ApiError('Unauthorized', UNAUTHORIZED);
    }

    const user = await userService.findUserByUUID(payload.uuid as string);

    if (!user) {
      throw new ApiError('Unauthorized', UNAUTHORIZED);
    }

    const storedToken =
      await refreshTokenService.refreshTokenExists(refreshToken);

    if (!storedToken) {
      throw new ApiError('Unauthorized', UNAUTHORIZED);
    }

    const tokens = JwtService.generateTokens(payload.uuid as string);

    await refreshTokenService.deleteOne({ token: refreshToken });
    await refreshTokenService.createOne({
      token: tokens.refreshToken,
      userUuid: payload.uuid as string,
      expiresAt: new Date(Date.now() + MAGIC_NUMBERS.ONE_WEEK_IN_MILLISECONDS),
    });

    return tokens;
  }

  async verifyEmail(token: string, userUuid: string) {
    const storedToken = await redisService.get<string>(`verify-email:${token}`);

    if (!storedToken || storedToken !== token) {
      throw new ApiError('Verification token is invalid or expired', GONE);
    }

    const user = await userService.findUserByUUID(userUuid);

    if (!user) {
      throw new ApiError('User not found', NOT_FOUND);
    }

    await userService.updateOne({ uuid: userUuid }, { isVerified: true });
    await redisService.delete(`verify-email:${token}`);
  }

  async resendVerificationEmail(email: string) {
    const user = await userService.findUserByEmail(email);

    if (!user) {
      throw new ApiError('User not found', NOT_FOUND);
    }

    if (user.isVerified) {
      throw new ApiError('Email already verified', CONFLICT);
    }

    const verificationToken = crypto
      .randomBytes(MAGIC_NUMBERS.NUMBER_OF_BYTES)
      .toString('hex');

    await redisService.set(
      `verify-email:${verificationToken}`,
      verificationToken,
      MAGIC_NUMBERS.ONE_DAY_IN_SECONDS
    );

    emailService.sendVerificationEmail(
      email,
      user.name as string,
      verificationToken
    );
  }

  async generateOTP(email: string) {
    const user = await userService.findUserByEmail(email);

    if (user) {
      const otp = generateCode();

      await otpService.createOne({
        otp,
        userUuid: user.uuid,
        expiresAt: new Date(
          Date.now() + MAGIC_NUMBERS.FIFTEEN_MINUTES_IN_MILLISECONDS
        ),
      });

      await redisService.set(
        `otp:${user.uuid}`,
        otp,
        MAGIC_NUMBERS.FIFTEEN_MINUTES_IN_SECONDS
      );

      emailService.sendForgetPasswordEmail(email, user.name as string, otp);
    }
  }

  async verifyOTP(email: string, password: string, otp: string) {
    const user = await userService.findUserByEmail(email);

    if (!user) {
      throw new ApiError('User not found', NOT_FOUND);
    }

    const storedOTP = await redisService.get<string>(`otp:${user.uuid}`);

    if (!storedOTP || String(storedOTP).trim() !== String(otp).trim()) {
      throw new ApiError('Invalid or expired OTP', GONE);
    }

    await redisService.delete(`otp:${user.uuid}`);

    const hashedPassword = await HashingService.hash(password);

    await userService.updateOne(
      { uuid: user.uuid },
      { password: hashedPassword }
    );
    await refreshTokenService.deleteMany({ userUuid: user.uuid });
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
}

export const authService = new AuthService();
