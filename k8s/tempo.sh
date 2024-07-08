# References:
# https://grafana.com/docs/helm-charts/tempo-distributed/next/get-started-helm-charts/

# Create tempo namespace
kubectl create namespace grafana-tempo

# Install Grafana Tempo
helm -n grafana-tempo install grafana-tempo grafana/tempo-distributed -f << EOF
---
storage:
  trace:
    backend: s3
    s3:
      access_key: 'grafana-tempo'
      secret_key: 'supersecret'
      bucket: 'tempo-traces'
      endpoint: 'tempo-minio:9000'
      insecure: true
#MinIO storage configuration
minio:
  enabled: true
  mode: standalone
  rootUser: grafana-tempo
  rootPassword: supersecret
  buckets:
    # Default Tempo storage bucket
    - name: tempo-traces
      policy: none
      purge: false
traces:
  otlp:
    grpc:
      enabled: true
    http:
      enabled: true
  zipkin:
    enabled: false
  jaeger:
    thriftHttp:
      enabled: false
  opencensus:
    enabled: false
EOF