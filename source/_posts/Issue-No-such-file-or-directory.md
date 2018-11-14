---
title: 'Issue:No such file or directory'
tags:
  - Linux
date: 2018-11-14 10:23:11
categories: 问题记录
---
# Clarify this issue
If you trying to execute a executable binary, but you see this error "No such file or directory", it's normally caused by you trying to run a 32-bits binary on a 64-bits OS.
<!--more-->

First of all you should check your OS:
```bash
uname -a
```
If you see **x86_64**, we can make sure you are using a 64-bits OS.
Then we should check file type of executable binary:
```bash
file ${THE_EXECUTABLE_BIN}
```
If you see **ELF 32-bit LSB executable, Intel 80386**, basically we can make sure you are trying to run a 32-bits binary on a 64-bits OS meanwhile your OS haven't add **i386** architecture yet.

# How to fix it
We need to add **i386** architecture support on your 64-bits OS.
```bash
sudo dpkg --add-architecture i386
sudo apt-get update
sudo apt-get install multiarch-support
sudo apt-get install libc6:i386 libncurses5:i386 libstdc++6:i386
```
After that, try to run it again :)