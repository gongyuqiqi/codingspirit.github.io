---
title: 'Jenkins (I): Install Jenkins On Ubuntu 18.04/20.04'
top: false
tags:
  - Jenkins
  - Continuous Integration
date: 2020-09-15 20:29:36
categories: CI
---

...

<!--more-->

# Jenkins: Install Jenkins On Ubuntu 18.04/20.04

## Install Java

Jenkins requires java in order to run:

```bash
sudo apt install openjdk-11-jdk
```

> Note: In current release, Jenkins only supports Java 8/11. For more information, check [Java requirements](https://www.jenkins.io/doc/administration/requirements/java/)


## Install Jenkins LTS Release By apt

```bash
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > \
    /etc/apt/sources.list.d/jenkins.list'
sudo apt-get update
sudo apt-get install jenkins
```

## Start Jenkins

```bash
sudo systemctl start jenkins
```

If Jenkins is up and running, you could see similar log at `/var/log/jenkins/jenkins.log`:

```
2020-09-15 20:14:14.384+0000 [id=21]	INFO	hudson.WebAppMain$3#run: Jenkins is fully up and running
```

## Unlock Jenkins

Use browser to access `http://<your-jenkins-ip>:8080`:

![](Jenkins-I-Install-Jenkins-On-Ubuntu-18-04-20-04/unlock-jenkins-page.jpg)

Get the `initialAdminPassword` by `sudo cat /var/lib/jenkins/secrets/initialAdminPassword`, or find it in `/var/log/jenkins/jenkins.log`.
