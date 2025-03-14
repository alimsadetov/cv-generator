import { Request } from 'express';
import { JwtPayload } from './jwt-payload.type';

export interface ExtendedRequest extends Request {
  user: JwtPayload;
}
