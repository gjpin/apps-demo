# References:
# https://grafana.com/docs/helm-charts/mimir-distributed/latest/get-started-helm-charts/

# Create mimir namespace
kubectl create namespace mimir

# Install Grafana Mimir
helm -n mimir install mimir grafana/mimir-distributed