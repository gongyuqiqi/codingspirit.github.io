---
title: i.MX8 adb bring up
top: false
tags:
  - Linux
  - Yocto
date: 2019-07-27 02:49:35
categories: 随便写写
---

The default BSP provided by NXP doesn't support **adb**, we have to port it by ourselves. Our goal is making **adbd** running on SoC meanwhile we can use **adb** through USB port.
Let's have a quick summary before I forget it(I already done this 3 months ago...)

<!--more-->

## Source code of adb & adbd

You can find adb & adbd source codes easily, but I found that there is a recipe in openembedded already provided adb & adbd:
*meta-openembedded/meta-oe/recipes-devtools/android-tools*
But the default recipes can't work on imx8mm through USB. We need do some modifications later.

## Adding support for login adb as root

There is a function called **should_drop_privileges** in adbd source code, modify this function that makes it always return 0 to disallow drop privileges. It has been added into newer openembedded but not the i.mx BSP.

```patch
From 3a788e9168c9b9eac66c4fa479413f4a95c61be4 Mon Sep 17 00:00:00 2001
From: Florent Revest <revestflo@gmail.com>
Date: Mon, 30 Oct 2017 21:05:46 +0100
Subject: [PATCH] adb: Allow adbd to be ran as root

---
 adb/adb.c | 1 +
 1 file changed, 1 insertion(+)

diff --git a/adb/adb.c b/adb/adb.c
index 027edd9359..e0f7ecde45 100644
--- a/adb/adb.c
+++ b/adb/adb.c
@@ -1271,6 +1271,7 @@ static int should_drop_privileges() {
     int secure = 0;
     char value[PROPERTY_VALUE_MAX];
 
+    return 0;
    /* run adbd in secure mode if ro.secure is set and
     ** we are not in the emulator
     */

```
You need to add this patch into recipe sources as well:

```bb
SRC_URI += " \
    file://0008-adb-Allow-adbd-to-be-ran-as-root.patch;patchdir=system/core \
"
```

## Adding support for USB adb

To connect adbd through USB, we need support from usb function filesystem. To enable it in kernel:

```
  │ Symbol: USB_FUNCTIONFS [=m]                                                                      │  
  │ Type  : tristate                                                                                 │  
  │ Prompt: Function Filesystem                                                                      │  
  │   Location:                                                                                      │  
  │     -> Device Drivers                                                                            │  
  │       -> USB support (USB_SUPPORT [=y])                                                          │  
  │         -> USB Gadget Support (USB_GADGET [=y])                                                  │  
  │ (4)       -> USB Gadget precomposed configurations (<choice> [=m])                               │  
  │   Defined at drivers/usb/gadget/legacy/Kconfig:196                                               │  
  │   Depends on: <choice>                                                                           │  
  │   Selects: USB_LIBCOMPOSITE [=y] && USB_F_FS [=y] && USB_FUNCTIONFS_GENERIC [=y]
```

After installation of **USB_FUNCTIONFS**, we need to *modprobe* and *mount* functionfs before adbd start(initialization):

```sh
#!/bin/sh

modprobe g_ffs idVendor=0x18d1 idProduct=0x4e42 iSerialNumber="codingspirit"
mkdir -p /dev/usb-ffs/adb
mount -t functionfs adb /dev/usb-ffs/adb -o uid=0,gid=0
```

Then we can start adbd now.

In my case I'm using systemd to do this initialization(as a **ExecStartPre**), then set */usr/bin/adbd* as **ExecStart**.

After all of those steps, we can do quick test by **adb devices**! If everything goes well, you can see your device has been recognized. Then use **adb shell** to login, a **#** symbol should be shown which means you are in root.
