# Set number of concurrent connections
kubectl set env deployment/k6-load-test -n load-testing K6_VUS=1000

# Set test duration
kubectl set env deployment/k6-load-test -n load-testing K6_DURATION=60m

# Set number of k6 replicas
kubectl scale deployment k6-load-test -n load-testing --replicas=2