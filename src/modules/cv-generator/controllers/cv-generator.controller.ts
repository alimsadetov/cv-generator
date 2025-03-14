import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { CvGeneratorService } from '../services/cv-generator.service';
import { GenerateCvDto } from '../dto/cv.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CV Generator')
@Controller('cv-generator')
export class CvGeneratorController {
  constructor(private readonly cvGeneratorService: CvGeneratorService) {}

  @Post('generate')
  async generateCv(
    @Body() cvData: GenerateCvDto,
    @Res() res: Response,
  ): Promise<void> {
    const pdf = await this.cvGeneratorService.generatePdf(cvData);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');
    res.send(pdf);
  }
} 