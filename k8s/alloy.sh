# References:
# https://grafana.com/docs/alloy/latest/configure/kubernetes/
# https://grafana.com/docs/beyla/latest/tutorial/helm-alloy/
# https://github.com/grafana/beyla/blob/main/deployments/02-grafana-agent.yml

# Create alloy namespace
kubectl create namespace grafana-alloy

# Alloy configmap
cat <<EOF | kubectl create configmap -n grafana-alloy grafana-alloy-config --from-file=config.alloy=/dev/stdin
otelcol.receiver.otlp "default" {
  grpc {}
  http {}

  output {
    metrics = [otelcol.processor.batch.default.input]
    traces = [otelcol.processor.batch.default.input]
  }
}
  
otelcol.processor.batch "default" {
  output {
    metrics = [otelcol.exporter.prometheus.default.input]
    traces  = [otelcol.exporter.otlp.tempo.input]
  }
}
  
otelcol.exporter.prometheus "default" {
  forward_to = [prometheus.remote_write.mimir.receiver]
}
  
prometheus.remote_write "mimir" {
  endpoint {
    url = "http://grafana-mimir.grafana-mimir.svc.cluster.local:9009/api/v1/push"
  }
}
  
otelcol.exporter.otlp "tempo" {
  client {
    endpoint = env("http://grafana-tempo.grafana-tempo.svc.cluster.local:4318/v1/traces")
  }
}
EOF

# Install Grafana Alloy helm chart
helm install -n grafana-alloy grafana-alloy grafana/alloy -f - << EOF
alloy:
  configMap:
    create: false
    name: grafana-alloy-config
    key: config.alloy
EOF