---
title: Give serial port access to normal user
top: false
tags:
  - Linux
date: 2020-06-22 19:33:43
categories: 随便写写
---

When we try to access a serial port device(i.e **/dev/ttyUSB0**) as a normal user, a *Permission denied* error will occur. Let's take a look at permissions for those serial port devices:

```bash
ll /dev/ttyUSB0
crw-rw---- 1 root dialout 188, 0 6月  22 19:28 /dev/ttyUSB0
```

As we can see, except root user, **dialout** group also has permissions to those serial port tty devices. Hence, to allow normal user access serial port devices, adding normal user to **dialout** group will suffice:


```bash
sudo usermod -aG dialout $USER
```
