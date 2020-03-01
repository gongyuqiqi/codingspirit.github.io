---
title: 'STM32MP1 getting started: setup environments'
top: false
tags:
  - Linux
  - Yocto
date: 2019-11-16 09:14:45
categories: 系统构建
---
I'm planing to do some research on ST newest MPU series: STM32MP1. It's a Cortex A7(solo or dual core) + M4 solution, not very powerful but the price might be very competitive. In this post we will setup the development environments.
<!--more-->

## Choose the suitable base software package
There are 3 basic software packages provided by ST:
- Starter Package(For evaluation)
- Developer Package(For limited modification and application development)
- Distribution Package(For creating custom distribution)

Similar with Qualcomm solutions, there are two packages are available for development purpose. In my scenario I will use Distribution Package for sure, so the following parts of this post is about how to setup environments for Developer Package based development.

BTW the experiences I got during Qualcomm apq8009 based SoC really sucks... Their packages just like a huge shit mountain.

## Initialize repo
If you are new to Yocto, you need to install some packages before start(i.e. **repo**)
```bash
mkdir openstlinux-4.19-thud-mp1-19-10-09 && cd openstlinux-4.19-thud-mp1-19-10-09
repo init -u https://github.com/STMicroelectronics/oe-manifest.git -b refs/tags/openstlinux-4.19-thud-mp1-19-10-09
repo sync
```
## Package structure

From [ST WIKI](https://wiki.st.com/stm32mpu/wiki/STM32MP1_Distribution_Package):

```bash
openstlinux-4.19-thud-mp1-19-10-09  OpenSTLinux distribution
├── layers 
│    ├── meta-openembedded                Collection of layers for the OpenEmbedded-Core universe (OpenEmbedded standard)
│    ├── meta-qt5                         QT5 layer for OpenEmbedded (standard)
│    ├── meta-st
│    │   ├── meta-st-openstlinux          STMicroelectronics layer that contains the frameworks and images settings for the OpenSTLinux distribution
│    │   ├── meta-st-stm32mp              STMicroelectronics layer that contains the description of the BSP for the STM32 MPU devices
│    │   │   ├── recipes-bsp
│    │   │   │   ├── alsa                 Recipes for ALSA control configuration
│    │   │   │   ├── drivers              Recipes for Vivante GCNANO GPU kernel drivers
│    │   │   │   ├── trusted-firmware-a   Recipes for TF-A
│    │   │   │   └── u-boot               Recipes for U-Boot
│    │   │   ├── recipes-extended
│    │   │   │   ├── linux-examples       Recipes for Linux examples for STM32 MPU devices
│    │   │   │   ├── m4coredump           Recipes for script to manage coredump of cortexM4
│    │   │   │   └── m4projects           Recipes for firmware examples for Cortex M4
│    │   │   ├── recipes-graphics
│    │   │   │   ├── gcnano-userland      Recipes for Vivante libraries OpenGL ES, OpenVG and EGL (multi backend)
│    │   │   │   └── [...]
│    │   │   ├── recipes-kernel
│    │   │   │   ├── linux                Recipes for Linux kernel
│    │   │   │   └── linux-firmware       Recipes for Linux firmwares (example, Bluetooth firmware)
│    │   │   ├── recipes-security
│    │   │   │   └── optee                Recipes for OPTEE
│    │   │   ├── recipes-st
│    │   │   │   └── images               Recipes for the bootfs and userfs partitions binaries
│    │   │   └── [...]
│    │   ├── meta-st-stm32mp-addons       STMicroelectronics layer that helps managing the STM32CubeMX integration
│    │   └── scripts
│    │       ├── envsetup.sh              Environment setup script for Distribution Package
│    │       └── [...]
│    ├── meta-timesys                     Timesys layer for OpenEmbedded (standard)
│    └── openembedded-core                Core metadata for current versions of OpenEmbedded (standard)
```

## Test building image
### Environment setup
```bash
DISTRO=openstlinux-weston MACHINE=stm32mp1 source layers/meta-st/scripts/envsetup.sh
```
If you want to test without wayland or x11 support, using **DISTRO=openstlinux-eglfs MACHINE=st-image-core** instead.

If build folder has been created, using blow command to re-use it:
```bash
source layers/meta-st/scripts/envsetup.sh build-openstlinuxweston-stm32mp1/
```
### Trigger building
```bash
bitbake st-image-weston
```
**st-image-core** is also available if you want to create a console only image.

## USB Flash
USB flash need to use [STM32CubeProgrammer](https://my.st.com/content/my_st_com/en/products/development-tools/software-development-tools/stm32-software-development-tools/stm32-programmers/stm32cubeprog.html). Device need to switched as usb flash mode as well.

After installation, using **STM32_Programmer_CLI** to check if device can be detected:
```bash
$ sudo STM32_Programmer_CLI -l usb
      -------------------------------------------------------------------
                        STM32CubeProgrammer v2.2.1                  
      -------------------------------------------------------------------

=====  DFU Interface   =====

Total number of available STM32 device in DFU mode: 1

  Device Index           : USB1
  USB Bus Number         : 001
  USB Address Number     : 004
  Product ID             : DFU in HS Mode @Device ID /0x500, @Revision ID /0x0000
  Serial number          : 004800293338511139303435
  Firmware version       : 0x0110
  Device ID              : 0x0500

```
> Notice: You may need to create a soft link from *$HOME/STMicroelectronics/STM32Cube/STM32CubeProgrammer/bin/STM32_Programmer_CLI*

You also can add an udev rule to allow connection without su:
```bash
sudo cp $HOME/STMicroelectronics/STM32Cube/STM32CubeProgrammer/Drivers/rules/50-usb-conf.rules /etc/udev/rules.d/
sudo service udev restart
```
If device can be found in DFU mode, using blow cmd to trigger usb flash:
```bash
STM32_Programmer_CLI -c port=usb1 -w flashlayout_st-image-weston/FlashLayout_xxxxxx.tsv
```
STM32CubeProgrammer using a `.tsv` file to specify flash layout and the binaries are going to use.
