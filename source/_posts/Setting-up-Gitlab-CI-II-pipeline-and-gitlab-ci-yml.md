---
title: 'Setting up Gitlab CI (II): pipeline and .gitlab-ci.yml'
top: false
tags:
  - Continuous integration
date: 2019-10-19 19:00:31
categories: CI
---

A brief introduction about how to setup Gitlab CI (part II).

<!--more-->

In [Setting up Gitlab CI (I): docker+gitlab-runner](https://lzqblog.top/2019-09-28/Setting-up-Gitlab-CI-I-docker-gitlab-runner/) we already created a docker image for gitlab-runner, which will be our CI environment. Next step is define the behaviors of your CI processes.

## Pipeline
[Creating and using CI/CD pipelines](https://docs.gitlab.com/ee/ci/pipelines.html):
>  Pipelines are the top-level component of continuous integration, delivery, and deployment.

If **.gitlab-ci.yml** has been set up correctly, you could see pipeline flow under *CI/CD->Pipelines*. 

## .gitlab-ci.yml

If CI was enabled in your gitlab projects, gitlab-runner will try to find a file named **.gitlab-ci.yml** in your repository root. This file will tell gitlab-runner what should be done during CI process. 

### image, variables

You need to specify the docker image and environment variables gitlab-runner are going to use at very beginning:
```yaml
image: localhost:5000/${name_of_your_image}
variables:
  SDK_VERSION: 1.2.3
```
In our case we use the image from local docker hub.

### stages, jobs and script

In normal cases, our pipeline should have 3 stages roughly:
- build
- test
- deploy
  
Stages can be split into several jobs like:
- code/commit style check
- downloading build dependencies
- build code
- run unit test
- run integration testing
- deploy

In **.gitlab-ci.yml**, job can be defined as:

```yaml
job_name:
  stage: test
  script:
    - uname -a
    - echo "hello"
```
**script** defines shell scripts which will be executed by gitlab-runner.

Each job must have a unique name, but there are some reserved keywords can't be used as job name:

- image
- services
- stages
- types
- before_script
- after_script
- variables
- cache

Job name also can start with a dot(**.**) like *.job*. If a job name started with a dot, it will be ignored by gitlab CI(gitlab-runner will skip it).

### More

There are a lot of features can be defined in **.gitlab-ci.yml**. Go to [GitLab CI/CD Pipeline Configuration Reference](https://docs.gitlab.com/ee/ci/yaml/README.html) for more details.