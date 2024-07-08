# References:
# https://grafana.com/docs/grafana/latest/setup-grafana/installation/helm/
# https://grafana.com/docs/grafana/latest/datasources/prometheus/

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