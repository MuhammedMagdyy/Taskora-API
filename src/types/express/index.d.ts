/* eslint-disable @typescript-eslint/naming-convention */
declare namespace Express {
  interface Request {
    user?: { uuid: string };
  }
}
