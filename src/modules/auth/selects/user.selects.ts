import { Prisma } from '@prisma/client';

export const mainInfo = {
  id: true,
  email: true,
  username: true,
  limit: {
    select: {
      limit: true,
      remain: true,
    },
  },
  profile: {
    select: {
      firstName: true,
      lastName: true,
    },
  },
} satisfies Prisma.UserSelect;
