# Build and push
## Docker
1. Create Github [Personal Access Token](https://github.com/settings/tokens/new)
   - Give read/write/delete package permissions
2. Login to registry: `docker login ghcr.io -u YOUR_GITHUB_USERNAME -p YOUR_PERSONAL_ACCESS_TOKEN`
3. Build images:
```
docker buildx build --no-cache --platform=linux/arm64 --tag=ghcr.io/gjpin/load-app-sdk:1.0 ./sdk/load-app
docker buildx build --no-cache --platform=linux/arm64 --tag=ghcr.io/gjpin/bff1-sdk:1.0 ./sdk/bff1
docker buildx build --no-cache --platform=linux/arm64 --tag=ghcr.io/gjpin/bff2-sdk:1.0 ./sdk/bff2
docker buildx build --no-cache --platform=linux/arm64 --tag=ghcr.io/gjpin/backend1-sdk:1.0 ./sdk/backend1
docker buildx build --no-cache --platform=linux/arm64 --tag=ghcr.io/gjpin/backend2-sdk:1.0 ./sdk/backend2

docker buildx build --no-cache --platform=linux/arm64 --tag=ghcr.io/gjpin/load-app:2.1 ./base/load-app
docker buildx build --no-cache --platform=linux/arm64 --tag=ghcr.io/gjpin/bff1:2.1 ./base/bff1
docker buildx build --no-cache --platform=linux/arm64 --tag=ghcr.io/gjpin/bff2:2.1 ./base/bff2
docker buildx build --no-cache --platform=linux/arm64 --tag=ghcr.io/gjpin/backend1:2.1 ./base/backend1
docker buildx build --no-cache --platform=linux/arm64 --tag=ghcr.io/gjpin/backend2:2.1 ./base/backend2
```

4. Push images:
```
docker push ghcr.io/gjpin/load-app-sdk:1.0
docker push ghcr.io/gjpin/bff1-sdk:1.0
docker push ghcr.io/gjpin/bff2-sdk:1.0
docker push ghcr.io/gjpin/backend1-sdk:1.0
docker push ghcr.io/gjpin/backend2-sdk:1.0

docker push ghcr.io/gjpin/load-app:2.1
docker push ghcr.io/gjpin/bff1:2.1
docker push ghcr.io/gjpin/bff2:2.1
docker push ghcr.io/gjpin/backend1:2.1
docker push ghcr.io/gjpin/backend2:2.1
```

## Podman
1. Create Github [Personal Access Token](https://github.com/settings/tokens/new)
  - Give read/write/delete package permissions
2. Login to registry: `docker login ghcr.io -u YOUR_GITHUB_USERNAME -p YOUR_PERSONAL_ACCESS_TOKEN`
3. Build images:
```
podman build --no-cache --tag=ghcr.io/gjpin/demo-apps-load-app:1.0 ./load-app
podman build --no-cache --tag=ghcr.io/gjpin/demo-apps-bff1:1.0 ./bff1
podman build --no-cache --tag=ghcr.io/gjpin/demo-apps-bff2:1.0 ./bff2
podman build --no-cache --tag=ghcr.io/gjpin/demo-apps-backend1:1.0 ./backend1
podman build --no-cache --tag=ghcr.io/gjpin/demo-apps-backend2:1.0 ./backend2
```
4. Push images:
```
podman push ghcr.io/gjpin/demo-apps-load-app:1.0
podman push ghcr.io/gjpin/demo-apps-bff1:1.0
podman push ghcr.io/gjpin/demo-apps-bff2:1.0
podman push ghcr.io/gjpin/demo-apps-backend1:1.0
podman push ghcr.io/gjpin/demo-apps-backend2:1.0
```