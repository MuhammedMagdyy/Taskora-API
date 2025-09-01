import { JobsOptions } from 'bullmq';
import { emailQueue } from '../queues';
import { HashingService } from '../services';
import { SendEmailVerificationJob, SendForgetPasswordJob } from '../types';
import { logger, MAGIC_NUMBERS, WORKERS } from '../utils';

export class EmailJob {
  static async addVerificationEmailJob(
    verificationJobDetails: SendEmailVerificationJob,
  ) {
    try {
      const hashedEmail = this.hashEmail(verificationJobDetails.email);
      const key = `verify-${hashedEmail}`;
      const jobOptions = this.createJobOptions(key);
      await emailQueue.add(
        WORKERS.SEND_VERIFICATION_EMAIL,
        {
          email: verificationJobDetails.email,
          name: verificationJobDetails.name,
          token: verificationJobDetails.token,
        },
        jobOptions,
      );

      logger.info(
        `Verification email job scheduled for ${verificationJobDetails.email} with key ${key}`,
      );
    } catch (error) {
      logger.error(`Failed to add verification email job: ${error}`);
      throw error;
    }
  }

  static async addForgetPasswordEmailJob(
    forgetPasswordDetails: SendForgetPasswordJob,
  ) {
    try {
      const hashedEmail = this.hashEmail(forgetPasswordDetails.email);
      const key = `forget-${hashedEmail}`;
      const jobOptions = this.createJobOptions(key);
      await emailQueue.add(
        WORKERS.SEND_FORGET_PASSWORD_EMAIL,
        {
          email: forgetPasswordDetails.email,
          name: forgetPasswordDetails.name,
          otp: forgetPasswordDetails.otp,
        },
        jobOptions,
      );

      logger.info(
        `Forget password email job scheduled for ${forgetPasswordDetails.email} with key ${key}`,
      );
    } catch (error) {
      logger.error(`Failed to add forget password email job: ${error}`);
      throw error;
    }
  }

  private static createJobOptions(jobId: string): JobsOptions {
    return {
      jobId,
      attempts: MAGIC_NUMBERS.MAX_NUMBER_OF_RETRIES,
      backoff: {
        type: 'fixed',
        delay: MAGIC_NUMBERS.FIVE_SECONDS_IN_MILLISECONDS,
      },
      removeOnComplete: MAGIC_NUMBERS.MAX_COUNT_FOR_REMOVE_ON_COMPLETE,
      removeOnFail: MAGIC_NUMBERS.MAX_COUNT_FOR_REMOVE_ON_FAILURE,
    };
  }

  private static hashEmail(email: string): string {
    return HashingService.generateHashWithHmac(email);
  }
}
