import { correctAnswer } from '../config';
import { redisClient } from '../database';
import { emailService, userService } from '../services';

export class CompetitionService {
  private static WINNERS_KEY = 'winners';
  private static LOCK_KEY = 'lock:winners';
  private static CHALLENGE_ENDED_KEY = 'challengeEnded';

  static async start() {
    await redisClient.set('correctAnswer', correctAnswer);
    await redisClient.del(this.WINNERS_KEY);
    await redisClient.del(this.CHALLENGE_ENDED_KEY);
    return { message: 'Challenge has started.' };
  }

  static async processAnswer(userUuid: string, answerId: number) {
    const userAttemptKey = `user:${userUuid}:attempted`;

    const correctAnswer = await redisClient.get('correctAnswer');
    if (!correctAnswer) {
      return { status: 'error', message: 'Challenge not started.' };
    }

    const challengeEnded = await redisClient.get(this.CHALLENGE_ENDED_KEY);
    if (challengeEnded) {
      return { status: 'challenge_ended', message: 'The challenge has ended.' };
    }

    const userAnswered = await redisClient.get(userAttemptKey);
    if (userAnswered) {
      return {
        status: 'already_answered',
        message: 'You have already submitted an answer.',
      };
    }

    await redisClient.set(userAttemptKey, 'true', { EX: 60 * 60 * 24 });

    if (parseInt(correctAnswer) !== answerId) {
      return { status: 'not_winner', message: 'Incorrect answer.' };
    }

    const lock = await redisClient.set(this.LOCK_KEY, 'locked', {
      NX: true,
      PX: 5000,
    });
    if (!lock) {
      return { status: 'error', message: 'Try again later.' };
    }

    try {
      const winners = await redisClient.lRange(this.WINNERS_KEY, 0, -1);
      if (winners.length >= 5) {
        return { status: 'not_winner', message: 'You answered too late.' };
      }

      if (!winners.includes(userUuid)) {
        await redisClient.rPush(this.WINNERS_KEY, userUuid);
        await redisClient.expire(this.WINNERS_KEY, 60 * 60 * 24);
      }

      const userInfo = await userService.getUserInfo(userUuid);

      await emailService.sendNotifyWinnerEmail(
        userInfo.email,
        userInfo.name as string,
      );

      return { status: 'winner', message: 'Congratulations! You won!' };
    } finally {
      await redisClient.del(this.LOCK_KEY);
    }
  }

  static async endChallenge() {
    await redisClient.set(this.CHALLENGE_ENDED_KEY, 'true', {
      EX: 60 * 60 * 24,
    });
    return { message: 'Challenge has been ended.' };
  }

  static async getWinners() {
    const winners = await redisClient.lRange(this.WINNERS_KEY, 0, -1);
    return { winners };
  }
}
