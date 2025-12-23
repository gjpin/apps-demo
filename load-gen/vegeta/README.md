# Set number of concurrent connections
kubectl set env deployment/vegeta -n vegeta VEGETA_RATE=1500

# Set test duration
kubectl set env deployment/vegeta -n vegeta VEGETA_DURATION_SECONDS=3600

# Set number of k6 replicas
kubectl scale deployment vegeta -n vegeta --replicas=30