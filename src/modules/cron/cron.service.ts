import { PrismaService } from '@database';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_WEEK)
  async updateInterviewLimits() {
    console.log('UPDATE INTERVIEW LIMITS');
    const allLimits = await this.prisma.userInterviewLimits.findMany();
    for (const limit of allLimits) {
      await this.prisma.userInterviewLimits.update({
        where: { userId: limit.userId },
        data: { remain: limit.limit },
      });
    }
  }
}
