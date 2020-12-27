---
title: 'CMake: Toolchain File'
top: false
tags:
  - cmake
date: 2020-12-27 19:16:07
categories: 编程相关
---

When we have a build system like Yocto or Buildroot, cross compiling a CMake project is a simple task - We just need to create a simple CMake inherited recipe. If the SoC vendor only provides toolchain for you to cross compile a single CMake project, CMake toolchain file is a good approach.


<!--more-->

## What is CMake Toolchain File

CMake has a variable [`CMAKE_TOOLCHAIN_FILE`](https://cmake.org/cmake/help/latest/variable/CMAKE_TOOLCHAIN_FILE.html?highlight=cmake_toolchain_file#variable:CMAKE_TOOLCHAIN_FILE):

> This variable is specified on the command line when cross-compiling with CMake. It is the path to a file which is read early in the CMake run and which specifies locations for compilers and toolchain utilities, and other target platform and compiler related information.

## Toolchain File Example

```cmake
SET(CMAKE_SYSTEM_NAME Linux)
# specify the cross compiler
SET(CMAKE_C_COMPILER   /toolchain/gcc-linaro-7.3.1-2018.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc)
SET(CMAKE_CXX_COMPILER /toolchain/gcc-linaro-7.3.1-2018.05-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-g++)

SET(CMAKE_FIND_ROOT_PATH /toolchain/gcc-linaro-7.3.1-2018.05-x86_64_aarch64-linux-gnu/)

SET(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
SET(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
SET(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
```

- `CMAKE_FIND_ROOT_PATH`: This variable tells CMake `find_*` commands need to look into this sysroot.
- `CMAKE_FIND_ROOT_PATH_MODE_LIBRARY`: This variable controls whether the `CMAKE_FIND_ROOT_PATH` and `CMAKE_SYSROOT` are used by `find_library()`. We set to `ONLY`, so CMake will `find_library` under this path only.
- `CMAKE_FIND_ROOT_PATH_MODE_INCLUDE`: This variable controls whether the `CMAKE_FIND_ROOT_PATH` and `CMAKE_SYSROOT` are used by `find_file()` and `find_path()`. We set to `ONLY`, so CMake will look into this path only.
