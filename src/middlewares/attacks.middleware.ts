import createDOMPurify from 'dompurify';
import { NextFunction, Request, Response } from 'express';
import { JSDOM } from 'jsdom';

const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

const sanitizeObject = <T>(dataToSanitize: T): T => {
  if (typeof dataToSanitize === 'string') {
    return DOMPurify.sanitize(dataToSanitize, { ALLOWED_TAGS: [] }) as T;
  } else if (Array.isArray(dataToSanitize)) {
    return dataToSanitize.map((item) => sanitizeObject(item) as T) as T;
  } else if (dataToSanitize && typeof dataToSanitize === 'object') {
    const sanitizedObj = {} as { [K in keyof T]: T[K] };
    for (const key in dataToSanitize) {
      if (Object.prototype.hasOwnProperty.call(dataToSanitize, key)) {
        sanitizedObj[key] = sanitizeObject(dataToSanitize[key]);
      }
    }
    return sanitizedObj;
  }
  return dataToSanitize;
};

export const xss = (req: Request, _res: Response, next: NextFunction): void => {
  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);
  next();
};
