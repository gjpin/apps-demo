import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// Enable diagnostic logging
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

// Set otlp endpoints
const otlpTracesEndpoint = process.env.OTLP_TRACES_ENDPOINT || 'http://k8s-monitoring-alloy-receiver.k8s-monitoring.svc.cluster.local:4318/v1/traces';
const otlpMetricsEndpoint = process.env.OTLP_METRICS_ENDPOINT || 'http://k8s-monitoring-alloy-receiver.k8s-monitoring.svc.cluster.local:4318/v1/metrics';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: otlpTracesEndpoint,
    headers: {},
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: otlpMetricsEndpoint,
      headers: {},
      concurrencyLimit: 1,
    }),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();