//npm run crud-gen VacancyTask vacancy2 id false
//VacancyTask - название модели
//vacancy2 - название модуля
//id - название поля, которое является id
//false - если false то id это string
//обязательный только первый параметр
//перед этим лучше вызвать npx prisma generate

const fs = require('fs');
const path = require('path');
const prismaClient = require('@prisma/client');


const modelName = process.argv[2];
const moduleName = process.argv[3] ? camelToDashedCase(process.argv[3]) : camelToDashedCase(modelName);

const idKeyName = process.argv[4] ? process.argv[4] : 'id'
const isIdKeyNumber = process.argv[5] ? (process.argv[5] === 'true' ? true : false) : true

const modelKeys = getModelKeys()

if (!modelName) {
  console.error('Пожалуйста, укажите название модели. Пример: node generateCrud.js ModelName');
} else {
  console.log('model name - ', modelName)
  generateCrud(modelName);
}

function generateCrud() {

  generateEntityServiceFile()
  generateFindManyParamsTypeFile()
  generateExceptionsConstFile()
  generateSwaggerDecoratorsFile()
  generateController()
  generateModelNameResponseFile()

  generateCreateDtoFile()
  generateUpdateDtoFile()

  console.log(`${camelToDashedCase(modelName)}-crud  файлы были успешно созданы`);
}

function getModelKeys() {
  try {
    return Object.keys(prismaClient[`${modelName}ScalarFieldEnum`])
  } catch { return [] }
}

function generateEntityServiceFile() {
  const fileContent = `import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database';
import { Prisma, ${modelName} } from '@prisma/client';
import { FindMany${modelName}Params } from '../types/find-many-${camelToDashedCase(modelName)}-params.type';

@Injectable()
export class ${modelName}Service {
  constructor(private readonly prisma: PrismaService) {}

  private readonly ${toCamelCase(modelName)}Rep = this.prisma.${toCamelCase(modelName)};

  async create(data: Prisma.${modelName}CreateInput | Prisma.${modelName}UncheckedCreateInput): Promise<${modelName}> {
    return this.${toCamelCase(modelName)}Rep.create({ data });
  }

  async update(params: {
    where: Prisma.${modelName}WhereUniqueInput;
    data: Prisma.${modelName}UpdateInput | Prisma.${modelName}UncheckedUpdateInput;
  }): Promise<${modelName}> {
    return this.${toCamelCase(modelName)}Rep.update(params);
  }

  async delete(where: Prisma.${modelName}WhereUniqueInput): Promise<${modelName}> {
    return this.${toCamelCase(modelName)}Rep.delete({ where });
  }

  async getList(params?: FindMany${modelName}Params): Promise<${modelName}[]> {
    return this.${toCamelCase(modelName)}Rep.findMany(params);
  }

  async getOne(where: Prisma.${modelName}WhereUniqueInput): Promise<${modelName} | null> {
    return this.${toCamelCase(modelName)}Rep.findUnique({ where });
  }

  async getOneOrThrow(where: Prisma.${modelName}WhereUniqueInput): Promise<${modelName}> {
    return this.${toCamelCase(modelName)}Rep.findUniqueOrThrow({ where });
  }
}`;

  // fs.writeFileSync(`src/modules/${moduleName}/services/${camelToDashedCase(modelName)}-crud.service.ts`, fileContent);
  writeFile(`src/modules/${moduleName}/services`, `${camelToDashedCase(modelName)}-crud.service.ts`, fileContent)
}

function generateFindManyParamsTypeFile() {
  const paramsTypeFileContent = `import { Prisma } from '@prisma/client';

export type FindMany${modelName}Params = {
  where?: Prisma.${modelName}WhereInput;
  orderBy?: Prisma.${modelName}OrderByWithRelationInput;
  take?: number;
  skip?: number;
};`;
  // fs.writeFileSync(`src/modules/${moduleName}/types/find-many-${camelToDashedCase(modelName)}-params.type.ts`, paramsTypeFileContent);
  writeFile(`src/modules/${moduleName}/types`, `find-many-${camelToDashedCase(modelName)}-params.type.ts`, paramsTypeFileContent)
}

function generateExceptionsConstFile() {
  const exceptionsConstContent = `export const ${toUnderscoreUpperCase(modelName)}_NOT_FOUND = '${modelName} не найден';`;

  // fs.writeFileSync(`src/modules/${moduleName}/exceptions/exceptions.const.ts`, exceptionsConstContent);
  writeFile(`src/modules/${moduleName}/exceptions`, `exceptions.const.ts`, exceptionsConstContent)
}

function generateSwaggerDecoratorsFile() {
  const swaggerDecoratorsContent = `import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ${modelName}Response } from '../../dto/response/${camelToDashedCase(modelName)}-response.dto';
import { ${toUnderscoreUpperCase(modelName)}_NOT_FOUND } from '../../exceptions/exceptions.const';

export function ApiCreate${modelName}() {
  return applyDecorators(
    ApiOperation({ summary: 'Create ${modelName}' }),
    ApiResponse({ status: 201, type: ${modelName}Response }),
  );
}

export function ApiUpdate${modelName}() {
  return applyDecorators(
    ApiOperation({ summary: 'Update ${modelName}' }),
    ApiParam({
      name: '${idKeyName}',
      description: '${idKeyName.toLocaleUpperCase()} ${modelName}',
      type: ${isIdKeyNumber ? 'Number' : 'String'},
      example: ${isIdKeyNumber ? 1 : `'e569b432-10c7-4e71-b03b-fac3dba870c9'`},
    }),
    ApiResponse({ status: 200, type: ${modelName}Response }),
    ApiResponse({ status: 404, description: ${toUnderscoreUpperCase(modelName)}_NOT_FOUND }),
  );
}

export function ApiDelete${modelName}() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete ${modelName}' }),
    ApiParam({
      name: '${idKeyName}',
      description: '${idKeyName.toLocaleUpperCase()} ${modelName}',
      type: ${isIdKeyNumber ? 'Number' : 'String'},
      example: ${isIdKeyNumber ? 1 : `'e569b432-10c7-4e71-b03b-fac3dba870c9'`},
    }),
    ApiResponse({ status: 200, type: ${modelName}Response }),
    ApiResponse({ status: 404, description: ${toUnderscoreUpperCase(modelName)}_NOT_FOUND }),
  );
}

export function ApiGetListOf${modelName}s() {
  return applyDecorators(
    ApiOperation({ summary: 'Get list of ${modelName}' }),
    ApiResponse({ status: 200, type: ${modelName}Response, isArray: true }),
  );
}

export function ApiGet${modelName}() {
  return applyDecorators(
    ApiOperation({ summary: 'Get ${modelName} by ${idKeyName.toLocaleUpperCase()}' }),
    ApiParam({
      name: '${idKeyName}',
      description: '${idKeyName.toLocaleUpperCase()} ${modelName}',
      type: ${isIdKeyNumber ? 'Number' : 'String'},
      example: ${isIdKeyNumber ? 1 : `'e569b432-10c7-4e71-b03b-fac3dba870c9'`},
    }),
    ApiResponse({ status: 200, type: ${modelName}Response }),
    ApiResponse({ status: 404, description: ${toUnderscoreUpperCase(modelName)}_NOT_FOUND }),
  );
}`;

  // fs.writeFileSync(`src/modules/${moduleName}/decorators/swagger/${camelToDashedCase(modelName)}-api.decorators.ts`, swaggerDecoratorsContent);
  writeFile(`src/modules/${moduleName}/decorators/swagger`, `${camelToDashedCase(modelName)}-api.decorators.ts`, swaggerDecoratorsContent)
}

function generateController() {
  const controllerFileContent = `import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ${modelName}Service } from '../services/${camelToDashedCase(modelName)}-crud.service';
import { Create${modelName}Dto } from '../dto/request/create-${camelToDashedCase(modelName)}.dto';
import { ${modelName}Response } from '../dto/response/${camelToDashedCase(modelName)}-response.dto';
import { ApiCreate${modelName}, ApiDelete${modelName}, ApiGetListOf${modelName}s, ApiGet${modelName}, ApiUpdate${modelName} } from '../decorators/swagger/${camelToDashedCase(modelName)}-api.decorators';
import { Update${modelName}Dto } from '../dto/request/update-${camelToDashedCase(modelName)}.dto';

@Controller('${camelToDashedCase(modelName)}')
@ApiTags('${modelName}')
export class ${modelName}Controller {
  constructor(private readonly ${toCamelCase(modelName)}Service: ${modelName}Service) {}

  @ApiCreate${modelName}()
  @Post()
  async create${modelName}(@Body() dto: Create${modelName}Dto): Promise<${modelName}Response> {
    return this.${toCamelCase(modelName)}Service.create(dto);
  }

  @ApiUpdate${modelName}()
  @Put(':id')
  async update${modelName}(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Update${modelName}Dto,
  ): Promise<${modelName}Response> {
    return this.${toCamelCase(modelName)}Service.update({ where: { id }, data: dto });
  }

  @ApiDelete${modelName}()
  @Delete(':id')
  async delete${modelName}(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<${modelName}Response> {
    return this.${toCamelCase(modelName)}Service.delete({ id });
  }

  @ApiGetListOf${modelName}s()
  @Get()
  async getListOf${modelName}s(): Promise<${modelName}Response[]> {
    return this.${toCamelCase(modelName)}Service.getList();
  }

  @ApiGet${modelName}()
  @Get(':id')
  async get${modelName}(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<${modelName}Response> {
    return this.${toCamelCase(modelName)}Service.getOneOrThrow({ id });
  }
}`;

  // fs.writeFileSync(`src/modules/${moduleName}/controllers/${camelToDashedCase(modelName)}-crud.controller.ts`, controllerFileContent);
  writeFile(`src/modules/${moduleName}/controllers`, `${camelToDashedCase(modelName)}-crud.controller.ts`, controllerFileContent)
}

function generateModelNameResponseFile() {
  const responseFileContent = `import { ApiProperty } from '@nestjs/swagger';
  import { ${modelName} } from '@prisma/client';
  
  ${modelKeys.map((key) => { return `//${key} \n` }).join('')}

  export class ${modelName}Response implements ${modelName} {
  }`;

  // fs.writeFileSync(`src/modules/${moduleName}/dto/response/${camelToDashedCase(modelName)}-response.dto.ts`, responseFileContent);
  writeFile(`src/modules/${moduleName}/dto/response`, `${camelToDashedCase(modelName)}-response.dto.ts`, responseFileContent)
}

function generateCreateDtoFile() {
  const responseFileContent = `import { ApiProperty } from '@nestjs/swagger';
  import { Prisma, ${modelName} } from '@prisma/client';
  
  ${modelKeys.map((key) => { return `//${key} \n` }).join('')}

  export class Create${modelName}Dto implements Prisma.${modelName}UncheckedCreateInput {
  }`;

  // fs.writeFileSync(`src/modules/${moduleName}/dto/request/create-${camelToDashedCase(modelName)}.dto.ts`, responseFileContent);
  writeFile(`src/modules/${moduleName}/dto/request`, `create-${camelToDashedCase(modelName)}.dto.ts`, responseFileContent)
}

function generateUpdateDtoFile() {
  const responseFileContent = `import { ApiProperty } from '@nestjs/swagger';
  import { Prisma, ${modelName} } from '@prisma/client';
  
  ${modelKeys.map((key) => { return `//${key} \n` }).join('')}

  export class Update${modelName}Dto implements Prisma.${modelName}UncheckedUpdateInput {
  }`;

  // fs.writeFileSync(`src/modules/${moduleName}/dto/request/update-${camelToDashedCase(modelName)}.dto.ts`, responseFileContent);
  writeFile(`src/modules/${moduleName}/dto/request`, `update-${camelToDashedCase(modelName)}.dto.ts`, responseFileContent)
}

function camelToDashedCase(input) {
  return input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function toCamelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

function toUnderscoreUpperCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
}

function writeFile(dir, name, fileContent) {
  const directory = dir;
  const fileName = name;
  const filePath = path.join(directory, fileName);

  // Проверяем существует ли папка, если нет - создаем её
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  // Записываем файл
  fs.writeFileSync(filePath, fileContent, 'utf8');
}