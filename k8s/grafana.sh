# References:
# https://grafana.com/docs/grafana/latest/setup-grafana/installation/helm/
# https://grafana.com/docs/grafana/latest/datasources/prometheus/
# https://grafana.com/docs/grafana/latest/datasources/tempo/configure-tempo-data-source/#provision-the-data-source

# Create grafana namespace
kubectl create namespace grafana

# Install Grafana
helm install grafana grafana/grafana --namespace grafana

# Set grafana user and password
helm upgrade grafana grafana/grafana -n grafana -f - << EOF
adminUser: admin
adminPassword: admin
EOF

datasources.yaml:
apiVersion: 1

datasources:
  - name: Mimir
    type: prometheus
    url: http://mimir.mimir.svc.cluster.local:9009/prometheus
  - name: Tempo
    type: tempo
    url: http://grafana-tempo.grafana-tempo.svc.cluster.local:3100
    basicAuth: false
    jsonData:
      serviceMap:
        datasourceUid: 'prometheus'
      nodeGraph:
        enabled: true