---
title: Use ffmpeg to make kazam recorded mp4 available for Android devices
top: false
tags:
  - 日志
date: 2020-06-13 10:36:51
categories: 随便写写
---

**kazam** is an easy to use screen record tool for Linux. User can install it via `apt install kazam` on Debian based distribution. After recording, **kazam** supports to save as mp4 files, which are 4:4:4 by default. To make it available for typical player on other platform, we can covert it to 4:2:0:

```sh
ffmpeg -i ${original.mp4} -vf format=yuv420p ${new.mp4}
```
