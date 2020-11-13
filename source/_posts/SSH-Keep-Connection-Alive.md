---
title: 'SSH: Keep Connection Alive'
top: false
tags:
  - 日志
date: 2020-11-13 22:05:12
categories: 随便写写
---

SSH connection will automatically drop due to timeout if there is no operation for a period. To keep connection alive, we can config ssh client to send a *keepalive* periodically. In *~/.ssh/config*, there is a parameter for this:


```
ServerAliveInterval 60
```

If we set this value to 60, SSH client will send a *keepalive* every 60 seconds.
