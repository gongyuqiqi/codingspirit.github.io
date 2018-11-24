---
title: 'Linux: ‘adb devices’ can''t find devices'
tags:
  - Linux
date: 2018-11-23 17:51:58
categories: 问题记录
---
A strange issue was found on my Debian PC that **adb devices** can't find any device meanwhile **lsusb** can find the device I need.
<!--more-->
## Issue

```bash
$ lsusb
Bus 002 Device 006: ID 18d1:4e26 Google Inc. 
$ adb devices
List of devices attached

```
## Solution

Copy the first 4 characters of your device ID when you type **lsusb** (mark it as red):

Bus 002 Device 006: ID <span style="color:red">18d1</span>:4e26 Google Inc. 

Add it into file *~/.android/adb_usb.ini* or create it if it doesn't exist:
```
# ANDROID 3RD PARTY USB VENDOR ID LIST -- DO NOT EDIT.
# USE 'android update adb' TO GENERATE.
# 1 USB VENDOR ID PER LINE.
0x18d1
```
After that, you need to restart your adb server:
```bash
$ adb kill-server 
$ adb start-server
$ adb devices
List of devices attached
0123456789ABCDEF	device

```
Now it can be detected by **adb devices**
