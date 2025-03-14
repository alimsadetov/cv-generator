import { ApiProperty } from '@nestjs/swagger';

export class AuthTokensDto {
  @ApiProperty({
    example: 'UzI1NiIsInR5cCI6IkpXVCJ9.OTA2NjN9.y001DjoFT1QmhBqthnKDHYC_Q_tp',
    description:
      "User's access token. To access private routes of API put it in the header 'Authorization'.",
  })
  readonly accessToken: string;
  @ApiProperty({
    example: 'eyJhbGciOiJnR5cCI6Ikp.eyJ1c2VyQW3N0.okK4tx7LrVvgTHyp',
    description:
      'Refresh token that can be used to retrieve a new access token when old is expired.',
  })
  readonly refreshToken?: string;
}
