---
title: Run tshark/wireshark In Docker
top: false
tags:
  - Docker
date: 2020-10-11 14:17:19
categories: 问题记录
---

Last week when I was trying to run tshark in a Docker container to capture http packets, tshark reported following error even with root user:

```
tshark: Couldn't run /usr/bin/dumpcap in child process: Operation not permitted
```

After searching, to access dumcap, we need to add `--cap-add` options when start container, then add user into **wireshark** group:

```bash
docker run --cap-add=NET_RAW --cap-add=NET_ADMIN $IMAGE
usermod -a -G wireshark $USER
```
