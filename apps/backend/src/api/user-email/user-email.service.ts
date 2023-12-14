import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, MongoRepository } from 'typeorm';
import { UserEmailEntity } from './user-email.entity';
import { UserEmail } from '@tdqa/types';

@Injectable()
export class UserEmailService {
  @InjectRepository(UserEmailEntity)
  private readonly repository: MongoRepository<UserEmailEntity>;

  public async getUserEmails(): Promise<UserEmail[]> {
    return this.repository.find();
  }

  public async createUserEmail(data: UserEmail): Promise<UserEmail> {
    const userMail = this.repository.create(data);
    await this.repository.save(userMail);

    return userMail;
  }

  public async deleteUserEmailById(id: string): Promise<DeleteResult> {
    const result = await this.repository.delete(id);

    if (!result.affected) {
      throw new NotFoundException([`UserMail with id ${id} not found`]);
    }

    return result;
  }
}
