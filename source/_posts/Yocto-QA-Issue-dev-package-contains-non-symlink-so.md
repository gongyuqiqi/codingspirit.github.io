---
title: 'Yocto QA Issue: -dev package contains non-symlink .so'
tags:
  - Linux
  - Yocto
date: 2019-04-29 19:11:37
categories: 问题记录
---
Last week I met an issue when I trying to include a shared lib(built by cmake) written by me into Yocto project, which has already been verified in buildroot.
The root cause is recipe trying to directly install a *.so lib into target filesystem, which doesn't meet Yocto QA request. Lib should be installed with version number(i.e. libabc.so.0.0.3), then use a soft link(i.e. libabc.so) link to it.
<!--more-->

## Quick fix

### If your lib is using cmake

Add below line to add lib version information in cmake:
```cmake
set_target_properties(${PROJECT_NAME} PROPERTIES VERSION 0.0.3 SOVERSION 0.0.3)
```
A better way:
```cmake
set(${PROJECT_NAME}_VERSION "0.0.3")
set_target_properties(${PROJECT_NAME} PROPERTIES VERSION ${${PROJECT_NAME}_VERSION} SOVERSION ${${PROJECT_NAME}_VERSION})
message(STATUS "Version: ${${PROJECT_NAME}_VERSION}")
```

After that, when you build it with bitbake, version number will be added to extension automatically, a soft link we mentioned will be created as well.

### Force Yocto ignore this warning

It's not recommended but you can add below line into your lib recipe to force Yocto ignore this issue:
```bb
INSANE_SKIP_${PN} = "dev-so"
```

As matter of fact, you can use this line to avoid almost all *QA Issues*, just replace **"dev-so"** into your error type.
