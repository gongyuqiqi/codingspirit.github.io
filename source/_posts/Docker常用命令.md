---
title: Docker常用命令
tags:
  - 日志
date: 2018-01-09 14:10:14
categories: 随便写写
---
Docker常用命令小结
Update: Translate to EN
<!--more-->

## Gather info

List all containers <br> 列出所有容器：
```bash
docker ps -a
```

Get container IP <br> 获取容器IP：
```bash
docker inspect 2d0142bd65a7 | grep IPAddress
```
*2d0142bd65a7* is a container id. <br> 其中 *2d0142bd65a7* 为容器ID。 

List all loadable images <br> 列出可以装载的镜像：
```bash
docker images
```

## Save,Load,Tag and cp

Save image to local file <br> 导出镜像：
```bash
docker save 1865b6805867 > image.tar
```
*1865b6805867* is a image id. <br> 其中 *1865b6805867* 为镜像ID。 

Create docker image based on a container <br> 基于容器创建镜像
```bash
docker commit ${container_id} ${image_name}:${image_tag}
```

Load image from local file <br> 导入镜像：
```bash
docker load < image.tar
```

Tag a image which id is *1865b6805867*(Only first 4 digits of ID is acceptable) <br>
为ID为*1865b6805867*的镜像打上TAG(没错，只需要ID前几位就可以)：
```bash
docker tag 1865 gcr.io/tensorflow/tensorflow:latest-devel
```

Copy a file or folder from container to local host:<br>
从容器复制文件到主机(如果你忘了从主机挂载文件夹):
```bash
docker cp ${containerID}:${file_path_in_container} ${host_path}
```
It's basically same when you trying to copy a file from host to container, just swap two parameters.

## Clean

Stop all containers <br> 停止所有容器 
```bash
docker kill $(docker ps -aq)
```

Delete all containers <br> 删除所有容器
```bash
docker rm $(docker ps -aq)
```
Change *$(docker ps -aq)* to container id to stop or delete the specific container.

Delete all images <br> 删除所有镜像
```bash
docker rmi $(docker images -q)
```
Change *$(docker images -q)* to image id to delete the specific image.

Remove unused data to free disk space <br> 删除未使用的数据以释放磁盘空间
```bash
docker system prune
```
