import { UserEmail } from '@tdqa/types';
import { DocumentDto } from '../../database/document.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserEmailDto extends DocumentDto implements UserEmail {
  @ApiProperty()
  public email: string;
}
