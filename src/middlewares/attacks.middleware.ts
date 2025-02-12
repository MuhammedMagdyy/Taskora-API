import { Request, Response, NextFunction } from 'express';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

export const xss = (req: Request, res: Response, next: NextFunction) => {
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = DOMPurify.sanitize(req.body[key], { ALLOWED_TAGS: [] });
    }
  }

  next();
};
