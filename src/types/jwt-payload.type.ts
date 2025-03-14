import { $Enums } from '@prisma/client';

export type JwtPayload = {
  id?: number;
  role?: $Enums.Role;
  ip: string;
  isLogined: boolean;
};
