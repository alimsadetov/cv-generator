import { LoggerModule } from '@/logger/logger.module';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from './services/prisma.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [],
  providers: [PrismaService, UserRepository],
  exports: [PrismaService, UserRepository],
})
export class DatabaseModule {}
