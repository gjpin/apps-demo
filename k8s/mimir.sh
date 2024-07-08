# References:
# https://grafana.com/docs/helm-charts/mimir-distributed/latest/get-started-helm-charts/

# Create mimir namespace
kubectl create namespace grafana-mimir

# Install Grafana Mimir
helm -n grafana-mimir install grafana-mimir grafana/mimir-distributed