import {
  ProfileGeneratedEntity,
  UserGeneratedEntity,
  UserInterviewLimitsGeneratedEntity,
} from '@/generated';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class UserProfileEntity extends PickType(ProfileGeneratedEntity, [
  'firstName',
  'lastName',
]) {}

export class AuthRegistrationEntity extends PickType(UserGeneratedEntity, [
  'id',
  'email',
  'username',
]) {
  @ApiProperty({ type: UserInterviewLimitsGeneratedEntity })
  @Type(() => UserInterviewLimitsGeneratedEntity)
  limit: UserInterviewLimitsGeneratedEntity;

  @ApiProperty({
    type: UserProfileEntity,
  })
  @Type(() => UserProfileEntity)
  profile: Pick<ProfileGeneratedEntity, 'firstName' | 'lastName'>;
}
