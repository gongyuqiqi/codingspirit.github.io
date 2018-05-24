---
title: 'make: warning: Clock skew detected'
tags:
  - Makefile
  - Linux
date: 2018-05-24 13:13:02
categories: 编程相关
---
Sometimes **make** will output warning like this:
```
make: warning:  Clock skew detected.  Your build may be incomplete.
```

It was caused by file time-stamps are ahead of clients' clock.
<!--more-->

It can be fixed by update time-stamps:
```sh
find . -exec touch {} \; 
```
Then **make clean** and **make** again
