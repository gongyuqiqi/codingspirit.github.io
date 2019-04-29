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

And use below line instead of directly set 

**DESTINATION** as **lib**:
```cmake
install(TARGETS ${PROJECT_NAME} LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR})
```

Variable **CMAKE_INSTALL_LIBDIR** will be set by Yocto automatically. The only issue is, if you use **CMAKE_INSTALL_LIBDIR** instead of **lib**, you can't built it on your PC directly without Yocto, because **CMAKE_INSTALL_LIBDIR** is not set.
My solution is make this change as a patch, which will be patched by Yocto recipe.

### Force Yocto ignore this warning

It's not recommended but you can add below line into your lib recipe to force Yocto ignore this issue:
```bb
INSANE_SKIP_${PN} = "dev-so"
```

As matter of fact, you can use this line to avoid almost all *QA Issues*, just replace **"dev-so"** into your error type.
