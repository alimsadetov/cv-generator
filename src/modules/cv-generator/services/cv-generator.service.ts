import { Injectable } from '@nestjs/common';
import { GenerateCvDto, CvTemplate, CvLanguage } from '../dto/cv.dto';
import { translations } from '../i18n/translations';
import * as handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CvGeneratorService {
  private readonly templatesDir = path.join(process.cwd(), 'templates', 'cv');

  constructor() {
    // Регистрируем хелперы для handlebars
    this.registerHandlebarsHelpers();
  }

  private registerHandlebarsHelpers() {
    handlebars.registerHelper('translate', function(key: string, language: string, options) {
      const keys = key.split('.');
      let translation = translations[language];
      
      for (const k of keys) {
        if (translation && translation[k]) {
          translation = translation[k];
        } else {
          return key;
        }
      }
      
      return translation;
    });

    handlebars.registerHelper('formatDate', function(date: string, language: string) {
      if (date.toLowerCase() === 'present') {
        return translations[language].dates.present;
      }
      return date;
    });
  }

  private getTemplatePath(template: CvTemplate): string {
    const templateMap = {
      [CvTemplate.MODERN]: 'modern.hbs',
      [CvTemplate.MINIMAL]: 'minimal.hbs',
      [CvTemplate.PROFESSIONAL]: 'professional.hbs',
      [CvTemplate.CREATIVE]: 'creative.hbs',
    };

    return path.join(this.templatesDir, templateMap[template]);
  }

  async generatePdf(cvData: GenerateCvDto): Promise<Buffer> {
    try {
      const templatePath = this.getTemplatePath(cvData.template);
      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      
      const template = handlebars.compile(templateContent);
      const html = template({
        ...cvData,
        t: translations[cvData.language]
      });
      
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      // Устанавливаем язык страницы
      await page.setContent(html, {
        waitUntil: 'networkidle0'
      });
      await page.evaluate((lang) => {
        document.documentElement.lang = lang;
      }, cvData.language);
      
      const pdf = await page.pdf({
        format: 'A4',
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        },
        printBackground: true
      });
      await browser.close();
      return Buffer.from(pdf);
    } catch (error) {
      throw new Error(`Ошибка при генерации PDF: ${error.message}`);
    }
  }
} 