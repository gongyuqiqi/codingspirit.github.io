---
title: i.MX setup auto login
top: false
tags:
  - Yocto
  - Linux
date: 2019-06-06 20:00:22
categories: 系统构建
---
The default BSP provided by NXP requires login in UART after booting up, which seems "unfriendly" to some users.
<!--more-->

In i.MX Yocto BSP, Login is provided by a systemd service called systemd-serialgetty:
**sources/poky/meta/recipes-core/systemd/systemd-serialgetty/serial-getty@.service**
This service will execute **agetty** when system booting up and require login.

So there are two ways to disable login:

## Replace agetty with **/bin/login**

```
ExecStart=/bin/login -f root
```

## Provide username to agetty

Add option **-a** to provide username to agetty.

```
[Service]
Environment="TERM=xterm"
#ExecStart=-/sbin/agetty -8 -L %I @BAUDRATE@ $TERM
ExecStart=-/sbin/agetty -8 -a root -L %I @BAUDRATE@ $TERM
Type=idle
Restart=always
RestartSec=0
```
