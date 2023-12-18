import { Octokit } from '@octokit/rest';
import { Injectable, Logger } from '@nestjs/common';
import { ThresholdOverrun } from '../trace-data-analysis/threshold-service';
import { env } from '../../env';
import { IGitClientService } from './git-client.service';
import { DockerComposeAnalysis, DockerComposeService } from '@tdqa/types';
import { parse } from 'yaml';

@Injectable()
export class GithubClientService implements IGitClientService {
  private octokit: Octokit;

  private logger = new Logger('GithubClientService');

  public constructor() {
    this.octokit = new Octokit({ auth: env.GITHUB_TOKEN });
  }

  public async getServiceInfosFromRepoFile(): Promise<DockerComposeAnalysis> {
    const dockerComposeFile = await this.getFileFromRepo('docker-compose.yml');

    return this.parseDockerComposeYaml(dockerComposeFile);
  }

  public createThresholdOverrunIssue(
    thresholdOverruns: ThresholdOverrun[]
  ): void {
    this.logger.log(
      '[createThresholdOverrunIssue] creating threshold overrun issue'
    );

    const title = 'Treshold Overruns detected by Trace Data Quality Analyser';

    const body = `Thresholds for quality check exceeded, see following ${JSON.stringify(
      thresholdOverruns
    )}`;

    this.createIssue(title, body);
  }

  private async createIssue(title: string, body: string): Promise<void> {
    this.logger.log('[createIssue] creating GitHub issue...');

    try {
      const response = await this.octokit.issues.create({
        owner: env.GITHUB_OWNER ?? '',
        repo: env.GITHUB_REPO ?? '',
        title,
        body,
      });

      this.logger.log('[createIssue] created GitHub issue', response);
    } catch (error) {
      this.logger.error('Error creating GitHub issue:', error);
      throw error;
    }
  }

  private async getFileFromRepo(filePath: string): Promise<string> {
    this.logger.log('[getFileFromRepo] getting file from repo...');

    try {
      const response = await this.octokit.repos.getContent({
        owner: 'open-telemetry' ?? '',
        repo: 'opentelemetry-demo' ?? '',
        path: filePath,
        mediaType: {
          format: 'raw',
        },
      });

      return JSON.stringify(response.data);
    } catch (error) {
      this.logger.error('Error getting file from repo:', error);
      throw error;
    }
  }

  private parseDockerComposeYaml(
    dockerComposeYaml: string
  ): DockerComposeAnalysis {
    const formattedString = parse(dockerComposeYaml);
    const doc = parse(formattedString);

    const services = doc?.services ? Object.keys(doc.services) : [];
    const dockerComposeServices: DockerComposeService[] = services
      .filter((serviceName) => serviceName.includes('service'))
      .map((serviceName) => {
        const service = doc.services[serviceName];

        let exposedPorts: string[] = [];

        if (service.ports && Array.isArray(service.ports)) {
          exposedPorts = service.ports
            .filter((port: any) => typeof port === 'string')
            .map((port: string) => port.split(':')[0]);
        }

        return {
          serviceName: serviceName,
          containerName: service.container_name,
          exposedPorts: exposedPorts,
          hostnames: service.hostname,
        };
      });

    return {
      serviceCount: dockerComposeServices.length,
      services: dockerComposeServices,
    };
  }
}
