---
title: 'CMake: Skip Compiler Check'
top: false
tags:
  - cmake
date: 2020-09-13 08:08:38
categories: 编程相关
---

CMake will try to check compiler is working or not if project languages was set to C/CXX. However, sometimes we just want to skip this test...

<!--more-->

# Solution 1: Manually Set COMPILER_WORKS Flag

```cmake
set(CMAKE_C_COMPILER_WORKS 1)
set(CMAKE_CXX_COMPILER_WORKS 1)
```

# Solution 2: Set project language to NONE

```cmake
project(<PROJECT-NAME> NONE)
```
