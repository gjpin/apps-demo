# Set number of concurrent connections
kubectl set env deployment/ab -n ab AB_GET_REQUESTS=2000
kubectl set env deployment/ab -n ab AB_GET_CONCURRENCY=1000
kubectl set env deployment/ab -n ab AB_POST_REQUESTS=2000
kubectl set env deployment/ab -n ab AB_POST_CONCURRENCY=1000
kubectl set env deployment/ab -n ab AB_TIMEOUT=30
kubectl set env deployment/ab -n ab SLEEP_BETWEEN=1

# Set number of ab replicas
kubectl scale deployment ab -n ab --replicas=70