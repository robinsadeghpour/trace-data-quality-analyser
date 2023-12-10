import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEmailService } from './user-email.service';
import { UserEmailController } from './user-email.controller';
import { UserEmailEntity } from './user-email.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEmailEntity])],
  controllers: [UserEmailController],
  providers: [UserEmailService],
  exports: [],
})
export class UserEmailModule {}
