import rateLimit from 'express-rate-limit';
import { MAGIC_NUMBERS, TOO_MANY_REQUESTS } from '../utils';

export const oneMinuteLimiter = rateLimit({
  windowMs: MAGIC_NUMBERS.ONE_MINUTE_IN_MILLISECONDS,
  max: MAGIC_NUMBERS.MAX_NUMBER_OF_ALLOWED_REQUESTS.ONE,
  message: 'Too many requests, please try again after a minute',
  handler: (_req, res, _next, options) => {
    res.status(TOO_MANY_REQUESTS).json({
      error: 'Rate limit exceeded',
      details: options.message,
      retryAfter: `${options.windowMs / 1000} seconds`,
    });
  },
});

export const twentyFourHourLimiter = rateLimit({
  windowMs: MAGIC_NUMBERS.ONE_DAY_IN_MILLISECONDS,
  max: MAGIC_NUMBERS.MAX_NUMBER_OF_ALLOWED_REQUESTS.TEN,
  message: 'Too many requests, please try again after a day',
  handler: (_req, res, _next, options) => {
    res.status(TOO_MANY_REQUESTS).json({
      error: 'Rate limit exceeded',
      details: options.message,
      retryAfter: `${options.windowMs / 1000} seconds`,
    });
  },
});
