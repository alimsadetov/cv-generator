import { Module } from '@nestjs/common';
import { CvGeneratorController } from './controllers/cv-generator.controller';
import { CvGeneratorService } from './services/cv-generator.service';

@Module({
  controllers: [CvGeneratorController],
  providers: [CvGeneratorService],
})
export class CvGeneratorModule {} 