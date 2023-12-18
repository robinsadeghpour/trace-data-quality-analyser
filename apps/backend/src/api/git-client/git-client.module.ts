import { Module } from '@nestjs/common';
import { GithubClientService } from './github-client.service';
import { IGitClientService } from './git-client.service';
import { GitClientController } from './git-client.controller';

@Module({
  imports: [],
  controllers: [GitClientController],
  providers: [{ provide: IGitClientService, useClass: GithubClientService }],
  exports: [IGitClientService],
})
export class GitClientModule {}
