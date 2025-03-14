import { IsString, IsArray, IsNotEmpty, ValidateNested, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum CvTemplate {
  MODERN = 'modern',
  MINIMAL = 'minimal',
  PROFESSIONAL = 'professional',
  CREATIVE = 'creative'
}

export enum CvLanguage {
  RU = 'ru',
  EN = 'en'
}

export class WorkExperienceDto {
  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  endDate: string;

  @IsArray()
  @IsString({ each: true })
  responsibilities: string[];
}

export class EducationDto {
  @IsString()
  @IsNotEmpty()
  institution: string;

  @IsString()
  @IsNotEmpty()
  degree: string;

  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  specialization: string;
}

export class GenerateCvDto {
  @IsEnum(CvTemplate)
  @IsNotEmpty()
  template: CvTemplate;

  @IsEnum(CvLanguage)
  @IsNotEmpty()
  language: CvLanguage;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  summary: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkExperienceDto)
  workExperience: WorkExperienceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  education: EducationDto[];

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsArray()
  @IsString({ each: true })
  languages: string[];
} 