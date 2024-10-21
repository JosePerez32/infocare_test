# Variables
VERSION=0.1.0
LOCAL_IMAGE = infocare/infocare-web
TAGGED_IMAGE = ghcr.io/infocura-git/infocare-web
K8S_IMAGE=ghcr.io/infocura-git/infocare-web-test
CONTAINER_NAME = infocare-web
DOCKERFILE_PATH = Dockerfile
DOCKERFILE_PATH_K8S = Dockerfile.k8s

# Default goal
.DEFAULT_GOAL := help

.PHONY: help
help:  ## Show this help.
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}'

.PHONY: build-k8s
build-k8s:  ## Build the Docker image for Kubernetes
	docker buildx build -t $(LOCAL_IMAGE):$(VERSION) -f $(DOCKERFILE_PATH_K8S) .
.PHONY: tag-k8s
tag-k8s: build-k8s  ## Tag the Docker image for Kubernetes
	docker tag $(LOCAL_IMAGE):$(VERSION) $(K8S_IMAGE):$(VERSION)
.PHONY: push-k8s
push-k8s: tag-k8s  ## Push the Docker image to GitHub Container Registry
	docker push $(K8S_IMAGE):$(VERSION)


.PHONY: build
build:  ## Build the Docker image
	docker buildx build -t $(LOCAL_IMAGE):$(VERSION) -f $(DOCKERFILE_PATH) .
.PHONY: run
run: build  ## Run the Docker container
	docker run -d --name $(CONTAINER_NAME) -p 8080:8080 --network=infocare-local-docker-env_default $(LOCAL_IMAGE):$(VERSION)
.PHONY: stop
stop:  ## Stop the Docker container
	docker stop $(CONTAINER_NAME)
.PHONY: remove
remove:   ## Remove the Docker container
	docker rm $(CONTAINER_NAME)

.PHONY: clean
clean:  ## Remove the Docker image
	docker rmi $(LOCAL_IMAGE):$(VERSION)

.PHONY: logs
logs:  ## Show logs of the Docker container
	docker logs -f $(CONTAINER_NAME)

.PHONY: exec
exec:  ## Execute a command in the running Docker container
	docker exec -it $(CONTAINER_NAME) /bin/sh

.PHONY: tag
tag:  ## Tag the Docker image
	docker tag $(LOCAL_IMAGE):$(VERSION) $(TAGGED_IMAGE):$(VERSION)

.PHONY: push
push: tag  ## Push the Docker image to Docker Hub
	docker push $(TAGGED_IMAGE):$(VERSION)
