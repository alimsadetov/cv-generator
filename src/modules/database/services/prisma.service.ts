import { CustomLoggerService } from '@/logger/custom-logger.service';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<{
    log: [
      { level: 'warn'; emit: 'event' },
      { level: 'info'; emit: 'event' },
      { level: 'error'; emit: 'event' },
      { level: 'query'; emit: 'event' },
    ];
  }>
  implements OnModuleInit
{
  constructor(private readonly logger: CustomLoggerService) {
    super({
      log: [
        { level: 'warn', emit: 'event' },
        { level: 'info', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'query', emit: 'event' },
      ],
    });
  }
  async onModuleInit() {
    try {
      await this.$connect();

      // this.$on('query', (e) => {
      //   this.logger.log(`query ${e.query}`, {
      //     context: 'sql',
      //     msg: JSON.stringify(e),
      //   });
      // });
      // this.$on('warn', (e) => {
      //   this.logger.warn(`warn ${e.message}`, {
      //     context: 'sql',
      //     msg: JSON.stringify(e),
      //   });
      // });

      // this.$on('info', (e) => {
      //   this.logger.log(`info ${e.message}`, {
      //     context: 'sql',
      //     msg: JSON.stringify(e),
      //   });
      // });

      // this.$on('error', (e) => {
      //   this.logger.error(`error in ${e.target}`, {
      //     context: 'sql',
      //     msg: JSON.stringify(e),
      //   });
      // });
      console.log(`BACKEND - ИДЕТ ПОДКЛЮЧЕНИЕ К БАЗЕ `);
    } catch (e) {
      console.log(e);
    }
  }
}
