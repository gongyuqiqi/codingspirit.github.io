---
title: Docker常用命令
tags:
  - 日志
date: 2018-01-09 14:10:14
categories: 随便写写
---
Docker常用命令小结
<!--more-->
列出所有容器：
```bash
docker ps -a
```

获取容器IP：
```bash
docker inspect `2d0142bd65a7` | grep IPAddress
```
其中 2d0142bd65a7 为容器ID。

删除所有容器：
```bash
docker rm $(docker ps -aq)
```

列出可以装载的镜像：
```bash
docker images
```

导出镜像：
```bash
docker save 1865b6805867> image.tar
```
其中 1865b6805867 为镜像ID。

导入镜像：
```bash
docker load < image.tar
```

为ID为1865b6805867的镜像打上TAG(没错，只需要ID前几位就可以)：
```bash
docker tag 1865 gcr.io/tensorflow/tensorflow:latest-devel
```
