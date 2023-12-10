import { Column, Entity } from 'typeorm';
import { DocumentEntity } from '../../database/document.entity';
import { UserEmail } from '@tdqa/types';

@Entity('user-email')
export class UserEmailEntity extends DocumentEntity implements UserEmail {
  @Column()
  public email: string;
}
