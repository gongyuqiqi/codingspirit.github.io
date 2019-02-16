---
title: 'Linux C/C++ debugging: using adb and gdb'
tags:
  - Linux
  - C++
date: 2019-02-16 19:38:56
categories: 编程相关
---
在大学的时候就一直用gdb + gdbserver 来远程调试C++， 前年开始用VS Code后在板上部署程序后配合VS Code调试更是爽到不行（根本停不下来），有种本地开发的感觉， 再也不用在蛋疼的GDB里面敲‘b’ 'r' 'c'， 哈哈。
最近的项目对adb的支持非常不错，usb上传下载速度比ssh不知道高到哪里去了。今天突然想到之前写Android app的时候都能通过usb和adb进行调试， 现在在Linux下调C++应该也可以通过usb+adb实现， 为什么不试一下呢？
<!--more-->

## gdb + gdbserver
既然要调C/C++， 这两兄弟基本上是必备了(VC++程序员表示并不需要)。 在target device上部署待调试程序并启动gdbserver，然后再在host上使用gdb target remote连接， 跨平台调试变得非常容易， 配合VS Code使用的例子可以参考[这里](https://github.com/codingspirit/VoiceSpirit/tree/develop/.vscode)

## adb forward
gdb和gdbserver可以提供调试的server和client， 只要client能够访问到server的指定端口，调试就能够进行。通常我们使用gdb+gdbserver， target device和host在一个局域网内， 通过socket能很轻松地实现连接。 如果我们要通过usb实现这个连接， 可以通过adb forward实现。 如果你在Android上写过通过socket通信的app（不禁想起了做毕设的时候）， 基本上都会用到这个cmd， 只需一行命令 **adb forward tcp:1234 tcp:5678**, 所有在host端1234端口的通信都会被重定向到target端的5678端口，调试socket时轻松愉快！ 有了它的帮助， 就能通过usb线实现socket连接了

## Step By Step

Let's have a quick step by step instruction:

First of all, build your C/C++ app and upload your app binary to target device.

Then we start **gdbserver** on target device:
```bash
#target device
gdbserver :${TARGET_PORT} ${EXEC_FILE}
```
i.e. :  **gdbserver :1234 /usr/bin/test_app**. gdbserver will listening at port 1234 and waiting for client to connect.

After that we can use **adb forward** on host PC(make sure usb connection is good and adb shell works well):
```bash
#host
adb forward tcp:${HOST_PORT} tcp:${TARGET_PORT}
```
All the communication data on specific host port will be redirected to target server port.
i.e. : **adb forward tcp:4567 tcp:1234**. Then all the data send to **localhost:4567** on host PC will be redirected to target device **1234** port.

Last step, start gdb on host PC then connect to target gdbserver:
```bash
#host
$ gdb
#make sure your gdb and your gdbserver are from one set of toolchain
GNU gdb (Debian 7.12-6) 7.12.0.20161007-git
Copyright (C) 2016 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.  Type "show copying"
and "show warranty" for details.
This GDB was configured as "x86_64-linux-gnu".
Type "show configuration" for configuration details.
For bug reporting instructions, please see:
<http://www.gnu.org/software/gdb/bugs/>.
Find the GDB manual and other documentation resources online at:
<http://www.gnu.org/software/gdb/documentation/>.
For help, type "help".
Type "apropos word" to search for commands related to "word".
(gdb) target remote :${HOST_PORT}
```
i.e. : **(gdb) target remote :4567**

Now we can start hunting bug!
