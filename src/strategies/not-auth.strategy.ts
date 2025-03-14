import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class NotAuthStrategy extends PassportStrategy(Strategy, 'not-auth') {
  constructor() {
    super();
  }

  authenticate() {
    const self: any = this;
    return self.success({ id: null });
  }
}
