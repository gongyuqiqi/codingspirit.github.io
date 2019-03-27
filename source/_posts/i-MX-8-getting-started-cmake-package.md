---
title: 'i.MX 8 getting started: cmake package'
tags:
  - Linux
  - Yocto
date: 2019-03-28 19:56:53
categories: 编程相关
---
We already started to use cmake instead of writing Makefile by our own in buildroot. Let's see how to have a cmake package in Yocto.
<!--more-->

## Add your source file and CMakeLists

Here we use a simple cpp source file to test c++11 and pthread.

**alexcmaketest.cpp** :

```cpp
#include <iostream>
#include <thread>
#include <memory>

int main()
{
    auto thread1 = std::make_unique<std::thread>([]() {
        std::cout << "hello world from thread1" << std::endl;
    });
    auto thread2 = std::make_unique<std::thread>([]() {
        std::cout << "hello world from thread2" << std::endl;
    });

    if (thread1->joinable())
        thread1->join();

    if (thread2->joinable())
        thread2->join();

    return 0;
}

```
Then prepare your CMakeLists.txt:

**CMakeLists.txt**:

```cmake
cmake_minimum_required(VERSION 2.8 FATAL_ERROR)

project(alexcmaketest)

file(GLOB SRC_FILES "*.cpp")

add_executable(${PROJECT_NAME} ${SRC_FILES})

target_link_libraries(${PROJECT_NAME} pthread)

install(TARGETS ${PROJECT_NAME} DESTINATION bin)

```

Notice : **install** should be added into your **CMakeLists.txt** if you want your binary to be installed into rootfs.

## Write your recipe

**cmakeexample_0.1.bb** :

```bb
SUMMARY = "cmake example"
DESCRIPTION = "Recipe for cmake test"
LICENSE = "GPL-2.0"
LIC_FILES_CHKSUM = "file://${COMMON_LICENSE_DIR}/GPL-2.0;md5=801f80980d171dd6425610833a22dbe6"

SRC_URI = "file://alexcmaketest.cpp \
            file://CMakeLists.txt"

S = "${WORKDIR}"

inherit cmake

```

There is no need to override **do_install** nor **do_config** in this scenario. **cmake.bbclass** has already defined those tasks and we can just inherit from it.
If **pkgconfig** is required by your cmake, use **inherit pkgconfig cmake** instead.

Then add your packages into your layer, don't forget config your package as <span style="color:red">IMAGE_INSTALL_append</span> in <span style="color:red">layer.conf</span>. After that, you should have a folder tree like this:

```bash
.
├── bitbake-cookerdaemon.log
├── conf
│   └── layer.conf
├── COPYING.MIT
├── README
├── recipes-cmakeexample
│   └── cmakeexample
│       ├── cmakeexample-0.1
│       │   ├── alexcmaketest.cpp
│       │   └── CMakeLists.txt
│       └── cmakeexample_0.1.bb
```

## Build your package!

```bash
$ bitbake cmakeexample
```
## Build your image

Of course don't forget to re-build your image.

```bash
$ bitbake fsl-image-qt5-validation-imx
```
