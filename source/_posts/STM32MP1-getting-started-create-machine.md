---
title: 'STM32MP1 getting started: create machine'
top: false
tags:
  - Linux
  - Yocto
date: 2019-11-30 15:11:37
categories: 编程相关
---
Brief notes about how to create a customized machine based on STM32MP1.
<!--more-->

## Device tree

dts files should be created at the very beginning. There are 3 dts files need to implement:
- TF-A device tree
- U-BOOT device tree
- Kernel device tree

## Machine layer

A custom layer can be created outside of *meta-st*:
```
.
├── conf
│   ├── eula
│   │   └── stm32mp1-cp
│   ├── layer.conf
│   └── machine
│       └── stm32mp1-cp.conf
├── COPYING.MIT
├── README
├── recipes-bsp
│   ├── trusted-firmware-a
│   │   ├── tf-a-stm32mp
│   │   │   └── 0001-tf-a-alex.patch
│   │   └── tf-a-stm32mp_2.0.bbappend
│   └── u-boot
│       ├── u-boot-stm32mp
│       │   └── 0001-u-boot-alex.patch
│       ├── u-boot-stm32mp_2018.11.bbappend
│       ├── u-boot-stm32mp-extlinux
│       │   └── boot.scr.cmd
│       └── u-boot-stm32mp-extlinux.bb
└── recipes-kernel
    └── linux
        ├── linux-stm32mp
        │   └── stm32mp157a-cp.dts
        └── linux-stm32mp_%.bbappend
```
Here I use patchs and *bbappend* to add dts files.

## Machine conf

Machine conf can be created based on **stm32mp1-disco.conf**. There are some variables are pre-defined in **st-machine-common-stm32mp.inc** which need to be override in your machine conf.

## U-Boot extlinux

There are some u-boot related env variables are set by **UBOOT_EXTLINUX_** started configs in machine conf. In ST U-Boot, there path of **extlinux.conf** are related to **UBOOT_EXTLINUX_BOOTPREFIXES**.
