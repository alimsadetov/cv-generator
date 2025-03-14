//import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { JwtConfigService } from './jwtConfig.service';
// import { SALT_ROUNDS } from '../config/global.config';

@Injectable()
export class SecureService {
  constructor(private readonly jwtConfigService: JwtConfigService) {}

  async hashString(text: string): Promise<string> {
    return hash(text, this.jwtConfigService.saultRounds);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }
}
