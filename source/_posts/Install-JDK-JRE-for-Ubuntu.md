---
title: Install JDK/JRE for Ubuntu
top: false
tags:
  - java
  - 日志
date: 2019-11-16 16:03:56
categories: 随便写写
---
...
<!--more-->

There are two versions of JDK/JRE can be installed on Ubuntu:
- Open JDK/JRE
- Oracle JDK/JRE

## Install Open JDK/JRE

**Open JDK/JRE** can be easily installed by
```bash
sudo apt install default-jre
sudo apt install default-jdk
```

## Install Oracle standalone JRE

1. First of all download Oracle JRE from [Oracle](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
2. Unpack downloaded package and install it into the path you like(i.e */usr/lib/java*)
    ```bash
    cd /usr/lib/java
    sudo tar -zxvf ~/Downloads/jre-8u231-linux-x64.tar.gz
    ```
3. Add JRE installation path into **$PATH**
    ```bash
    sudo nano /etc/environment
    ```
    Add <span style="color:red">**:/usr/lib/java/jre1.8.0_231**</span> into <span style="color:red">**PATH**</span>
4. Add installed java as alternative
    ```bash
    sudo update-alternatives --install /usr/bin/java java /usr/lib/java/jre1.8.0_231/bin/java 1
    ```
    To switch to other alternative java. use:
    ```bash
    sudo update-alternatives --config java
    ```
5. Check installation
    ```bash
    java -version
    java version "1.8.0_231"
    Java(TM) SE Runtime Environment (build 1.8.0_231-b11)
    Java HotSpot(TM) 64-Bit Server VM (build 25.231-b11, mixed mode)
    ```
