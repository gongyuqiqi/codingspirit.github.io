---
title: 'Yocto QA Issue: Files/directories were installed but not shipped in any package'
tags:
  - Linux
  - Yocto
date: 2019-05-02 19:55:53
categories: 问题记录
---
Yocto has much more strict rules than buildroot, one more QA Issue I met today is when I trying to install some regular files into rootfs by cmake **install**.
<!--more-->
## Root cause

Yocto/bitbake need to record every file you trying to install into rootfs, so it can easily remove those files when you trying to remove a package. Special case is When you trying to install **TARGET** by cmake like this:
```cmake
install(TARGETS ${PROJECT_NAME} DESTINATION bin)
```
Yocto will automatically record **TARGET** in this case if your **inherit cmake** recipe even you didn't declare it in recipe explicitly. However, if we trying to install some regular files(like some setting files,scripts etc.) by **install(FILES** or **install(DIRECTORY**, yocto will require us to declare those files explicitly.

## Fix
Declare those files in recipe:
```bb
FILES_${PN} += "/test/*"
# Change "/test/*" to where your regular file installed
```
