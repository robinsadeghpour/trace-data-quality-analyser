import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { mapToTraceData } from './elasticsearch-data.mapper';
import { Trace } from '@tdqa/types';
import { IDataSourceClientService } from './data-source.service';

@Injectable()
export class ElasticsearchDataSourceService
  implements IDataSourceClientService
{
  private readonly client: Client;
  private readonly index = process.env.ELASTICSEARCH_INDEX || 'trace_index';

  public constructor() {
    const node = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
    const auth =
      process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD
        ? {
            username: process.env.ELASTICSEARCH_USERNAME,
            password: process.env.ELASTICSEARCH_PASSWORD,
          }
        : undefined;

    this.client = new Client({
      node,
      auth,
    });
  }

  public async fetchTraceData(): Promise<Trace[]> {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const query = {
      query: {
        bool: {
          filter: [
            {
              range: {
                '@timestamp': {
                  gte: oneHourAgo,
                },
              },
            },
          ],
        },
      },
      aggs: {
        traces: {
          terms: {
            field: 'TraceId.keyword',
            size: 10000,
          },
          aggs: {
            top_spans: {
              top_hits: {
                size: 100,
              },
            },
          },
        },
      },
    };

    const { body: result } = await this.client.search({
      index: this.index,
      body: query,
      size: 0,
    });

    return result.aggregations.traces.buckets.map(
      (bucket) =>
        ({
          id: bucket.key,
          spans: bucket.top_spans.hits.hits.map((hit) =>
            mapToTraceData(hit._source)
          ),
        }) as Trace
    );
  }
}
