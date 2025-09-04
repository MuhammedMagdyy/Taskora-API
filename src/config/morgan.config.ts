import { Request, Response } from 'express';
import morgan, { Options } from 'morgan';
import { SERVER } from '../utils';
import { bullBoardQueuePath } from './general.env';
import { nodeEnv } from './server.env';

const skipAdminQueues = (req: Request, _res: Response) =>
  req.originalUrl.startsWith(bullBoardQueuePath);

const devOptions: Options<Request, Response> = {
  skip: skipAdminQueues,
};

const prodOptions: Options<Request, Response> = {
  skip: (req, res) => skipAdminQueues(req, res) || res.statusCode < 500,
};

export const morganLogger =
  nodeEnv === SERVER.DEVELOPMENT
    ? morgan('dev', devOptions)
    : morgan('combined', prodOptions);
