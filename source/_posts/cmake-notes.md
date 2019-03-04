---
title: cmake notes
tags:
  - cmake
date: 2019-03-04 10:14:47
categories: 编程相关
---
Take notes!
<!--more-->

## Use pkg-config in cmake
```cmake
#require gstreamer and check version, store flags/include dir/lib into variable ${GST}
pkg_check_modules(GST REQUIRED gstreamer-1.0>=1.10
                  gstreamer-app-1.0>=1.10)
#Then we can get hidden variables ${GST_LIBRARIES} ${GST_INCLUDE_DIRS} ${GST_CFLAGS_OTHER}
target_link_libraries(${PROJECT_NAME} boost_log pthread
                  ${GST_LIBRARIES})
target_include_directories(${PROJECT_NAME} PUBLIC ${GST_INCLUDE_DIRS})
target_compile_options(${PROJECT_NAME} PUBLIC ${GST_CFLAGS_OTHER})
```
## Add all files under a folder(i.e. add all source files)
```cmake
#option 1: use file(), store files into variable SRC_FILES
file(GLOB SRC_FILES "*.cpp")
#if there are sub-dirs should be searched, use recursive
file(GLOB_RECURSE SRC_FILES "*.cpp")
#option 2: use aux_source_directory(), store source files into variable SRC_FILES
aux_source_directory(. SRC_FILES)
```
