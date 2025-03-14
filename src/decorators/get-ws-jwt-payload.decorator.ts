import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayload } from 'src/types/jwt-payload.type';

export const GetWsJwtPayload = createParamDecorator(
  (
    data: keyof JwtPayload | undefined,
    context: ExecutionContext,
  ): JwtPayload | JwtPayload[keyof JwtPayload] => {
    const user = context.switchToWs().getClient().user;
    if (!user) return null;
    if (!data) return user;
    return user[data];
  },
);
