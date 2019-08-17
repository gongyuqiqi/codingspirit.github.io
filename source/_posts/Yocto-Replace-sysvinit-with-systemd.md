---
title: 'Yocto: Replace sysvinit with systemd'
top: false
tags:
  - Linux
  - Yocto
date: 2019-08-17 19:02:16
categories: 随便写写
---

There are some Yocto distributions still using sysvinit as their default init manager. To replace it with systemd, some modifications need to be done in **local.conf**:

<!--more-->

```conf
# build/conf/local.conf
DISTRO_FEATURES_append += "systemd"
VIRTUAL-RUNTIME_init_manager = "systemd"
DISTRO_FEATURES_BACKFILL_CONSIDERED += "sysvinit"
VIRTUAL-RUNTIME_initscripts = ""
```
