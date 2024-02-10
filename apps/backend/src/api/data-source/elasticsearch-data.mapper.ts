import { Span } from '@tdqa/types';

export function mapToTraceData(esSource: any): Span {
  return {
    timestamp: new Date(esSource['@timestamp']),
    endTimestamp: new Date(esSource['EndTimestamp']),
    kind: esSource['Kind'],
    link: JSON.parse(esSource['Link']),
    name: esSource['Name'],
    parentSpanId: esSource['ParentSpanId'],
    spanId: esSource['SpanId'],
    traceId: esSource['TraceId'],
    traceStatus: esSource['TraceStatus'],
    attributes: {
      method: esSource['Attributes.http.method'],
      url: esSource['Attributes.http.url'],
    },
    resource: {
      container: {
        id: esSource['Resource.container.id'],
      },
      host: {
        arch: esSource['Resource.host.arch'],
        name: esSource['Resource.host.name'],
      },
      os: {
        description: esSource['Resource.os.description'],
        name: esSource['Resource.os.name'],
        type: esSource['Resource.os.type'],
        version: esSource['Resource.os.version'],
      },
      process: {
        command: esSource['Resource.process.command'],
        commandArgs:
          typeof esSource['Resource.process.command_args'] === 'string'
            ? esSource['Resource.process.command_args'].split(' ')
            : undefined,
        commandLine: esSource['Resource.process.command_line'],
        executable: {
          name: esSource['Resource.process.executable.name'],
          path: esSource['Resource.process.executable.path'],
        },
        owner: esSource['Resource.process.owner'],
        pid: esSource['Resource.process.pid'],
        runtime: {
          description: esSource['Resource.process.runtime.description'],
          name: esSource['Resource.process.runtime.name'],
          version: esSource['Resource.process.runtime.version'],
        },
      },
      service: {
        instance: {
          id: esSource['Resource.service.instance.id'],
        },
        name: esSource?.Resource?.service?.name ?? 'Unknown Service',
        namespace: esSource['Resource.service.namespace'],
      },
      telemetry: {
        auto: {
          version: esSource['Resource.telemetry.auto.version'],
        },
        sdk: {
          language: esSource['Resource.telemetry.sdk.language'],
          name: esSource['Resource.telemetry.sdk.name'],
          version: esSource['Resource.telemetry.sdk.version'],
        },
      },
    },
  };
}
