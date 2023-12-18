import {Controller, Get, Inject, Post} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorDto } from '../../app/error.dto';
import { IGitClientService } from './git-client.service';
import { DockerComposeAnalysis } from '@tdqa/types';

@ApiTags('gitClient')
@Controller('gitClient')
export class GitClientController {
  public constructor(
    @Inject(IGitClientService)
    private readonly githubClientService: IGitClientService
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create GitHub Issue',
    description: 'This endpoint is for testing purposes only',
  })
  @ApiOkResponse()
  @ApiBadRequestResponse({ type: ErrorDto })
  public async createUserMail(): Promise<void> {
    this.githubClientService.createThresholdOverrunIssue([
      { metric: 'futureEntry', percentageChange: 50 },
    ]);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Service Infos from Repo File',
    description: 'This endpoint is for testing purposes only',
  })
  @ApiOkResponse({ type: Object })
  @ApiBadRequestResponse({ type: ErrorDto })
  public async getServiceInfosFromRepoFile(): Promise<DockerComposeAnalysis> {
    return this.githubClientService.getServiceInfosFromRepoFile();
  }
}
