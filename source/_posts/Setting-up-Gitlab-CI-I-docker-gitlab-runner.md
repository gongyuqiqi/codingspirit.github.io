---
title: 'Setting up Gitlab CI (I): docker+gitlab-runner'
top: false
tags:
  - Continuous Integration
date: 2019-09-28 08:14:36
categories: CI
---

A brief introduction about how to setup Gitlab CI (part I).

<!--more-->

If you are new to docker, this post might help: [Click this](https://lzqblog.top/2018-01-09/Docker%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4/)


## Install and setup gitlab runner

```bash
# Install gitlab runner docker image
docker run -d --name gitlab-runner --restart always \
  -v /srv/gitlab-runner/config:/etc/gitlab-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  gitlab/gitlab-runner:latest
# Config and register runner
docker exec -it ${container_id_of_gitlab-runner} gitlab-runner register
```

If you have installed gitlab-runner binary, you also can do register by one single command:

```bash
sudo gitlab-runner register \
  --non-interactive \
  --url "https://gitlab.com/" \
  --registration-token "PROJECT_REGISTRATION_TOKEN" \
  --executor "docker" \
  --docker-image alpine:latest \
  --description "description_of_runner" \
  --tag-list "docker,aws" \
  --run-untagged="true" \
  --locked="false" \
  --access-level="not_protected"
```

## Prepare your docker image as CI environment

Docker images can be built from a local **Dockerfile**:

```bash
docker build -t ${image_name}:${version_number} .
```
There is a "." at the end, don't forget it.

## Create local docker hub

Normally you can deploy your image to dockerhub.com. But if you don't want to open your images to public, you also can create a local docker hub instead:

```bash
docker run -d -p 5000:5000 --restart=always --name registry registry:2
docker tag ${image_name}:${image_tag} localhost:5000/${image_name}
docker push localhost:5000/${image_name}
```
After that gitlab-runner can "download" your images from *localhost:5000/${image_name}*. 

You also can do a quick check if your image repo exist or not by accessing catalog:

```bash
curl http://localhost:5000/v2/_catalog
```

To be continued...
