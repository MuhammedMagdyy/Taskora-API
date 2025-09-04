import rateLimit from 'express-rate-limit';
import { MAGIC_NUMBERS, TOO_MANY_REQUESTS } from '../utils';

/**
 * Creates an Express rate limiter middleware with the specified configuration.
 *
 * @param {number} windowMs - The time frame for which requests are checked/remembered (in milliseconds).
 * @param {number} max - The maximum number of allowed requests within the windowMs period.
 * @param {string} message - The message to send when the rate limit is exceeded.
 * @returns {RateLimitRequestHandler} - An Express middleware function that applies the rate limiting.
 */

export const createRateLimiter = (
  windowMs: number,
  max: number,
  message: string,
) => {
  return rateLimit({
    windowMs,
    max,
    message,
    handler: (_req, res, _next, options) => {
      res.status(TOO_MANY_REQUESTS).json({
        error: 'Rate limit exceeded',
        details: options.message,
        retryAfter: `${options.windowMs / 1000} seconds`,
      });
    },
  });
};

export const defaultLimiter = createRateLimiter(
  MAGIC_NUMBERS.ONE_MINUTE_IN_MILLISECONDS,
  MAGIC_NUMBERS.MAX_NUMBER_OF_ALLOWED_REQUESTS.TEN,
  'Too many requests, please try again after a minute',
);

export const twentyFourHourLimiter = createRateLimiter(
  MAGIC_NUMBERS.ONE_DAY_IN_MILLISECONDS,
  MAGIC_NUMBERS.MAX_NUMBER_OF_ALLOWED_REQUESTS.TWENTY,
  'Too many requests, please try again after a day',
);
