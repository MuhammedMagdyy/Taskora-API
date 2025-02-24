import { Provider } from '@prisma/client';
import { IUser } from '../../interfaces';
import { JwtService, refreshTokenService } from '..';
import { DEFAULT_VALUES, MAGIC_NUMBERS } from '../../utils';

export abstract class BaseAuthService {
  protected abstract readonly provider: Provider;

  protected async generateAndStoreTokens(userUuid: string) {
    const tokens = JwtService.generateTokens(userUuid);
    await refreshTokenService.createOne({
      token: tokens.refreshToken,
      userUuid,
      expiresAt: new Date(Date.now() + MAGIC_NUMBERS.ONE_WEEK_IN_MILLISECONDS),
    });

    return tokens;
  }

  protected formatUserResponse(user: IUser): IUser {
    return {
      uuid: user.uuid,
      name: user.name as string,
      email: user.email,
      isVerified: user.isVerified,
      picture: user.picture as string,
      hasPassword: user.hasPassword,
      createdAt: user.createdAt,
    };
  }

  protected createDefaultProjectAndTaskData(statusUuid: string) {
    return {
      projectData: {
        name: DEFAULT_VALUES.PROJECTS.name,
        description: DEFAULT_VALUES.PROJECTS.description,
        color: DEFAULT_VALUES.PROJECTS.color,
        statusUuid,
      },
      taskData: {
        name: DEFAULT_VALUES.TASKS.name,
        description: DEFAULT_VALUES.TASKS.description,
        statusUuid,
      },
    };
  }
}
