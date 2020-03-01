---
title: 'i.MX 8 getting started: setup environment'
tags:
  - Linux
  - Yocto
date: 2019-03-21 14:51:39
categories: 系统构建
---
This post will show you how to setup environment(Linux) for NXP i.MX 8 and build a image fot i.MX8 Mini EVK. If you trying to build a Android image, close this post.
<!--more-->

## Before start
Check your host environment:
- Fedora, openSUSE, CentOS, Debian, or Ubuntu(newer then 14.04, I test with 18.04)
- 120G disk space if graphical support is need
- Git is already setup on your machine

## Install tools
There are some packages you might haven't installed but required by Yocto:

- chrpath
- gawk
- u-boot-tools
  
use **apt install** install all of them.


Also for **repo**:
```bash
$ curl https://storage.googleapis.com/git-repo-downloads/repo  > /usr/local/bin/repo
$ chmod a+x /usr/local/bin/repo
```
You can choose your own repo install path, but make sure this path was added into **PATH**.

## Yocto project setup
We will use i.MX official repo to init.
```bash
$ mkdir imx-yocto-bsp 
$ cd imx-yocto-bsp 
$ repo init -u https://source.codeaurora.org/external/imx/imx-manifest  -b imx-linux-sumo -m imx-4.14.78-1.0.0_ga.xml 
$ repo sync
```
Use **-b &lt;branch-name&gt;** to switch to use other branch if you want. Check on [https://source.codeaurora.org/external/imx/imx-manifest](https://source.codeaurora.org/external/imx/imx-manifest) to find all available branches.

## Start build
### Choose one graphical backend for your image
- fsl-imx-x11 
- fsl-imx-wayland
- fsl-imx-xwayland
- fsl-imx-fb
For i.MX8, only fsl-imx-wayland and fsl-imx-xwayland are supported.
Then run:
```bash
$ DISTRO=fsl-imx-xwayland MACHINE=imx8mmevk source fsl-setup-release.sh -b build-xwayland 
$ bitbake fsl-image-qt5-validation-imx
```
Set **MACHINE** to other variable if you are not using i.MX8 Mini EVK. Use **-b** in **fsl-setup-release** to specify build dir.

Summaries of my build details:
```bash
Build Configuration:
BB_VERSION           = "1.38.0"
BUILD_SYS            = "x86_64-linux"
NATIVELSBSTRING      = "ubuntu-18.04"
TARGET_SYS           = "aarch64-poky-linux"
MACHINE              = "imx8mmevk"
DISTRO               = "fsl-imx-xwayland"
DISTRO_VERSION       = "4.14-sumo"
TUNE_FEATURES        = "aarch64"
TARGET_FPU           = ""
meta                 
meta-poky            = "HEAD:64a257fa22126c4a40ff7e03424a404e360ebe1e"
meta-oe              
meta-multimedia      = "HEAD:2bb21ef27c4b0c9d52d30b3b2c5a0160fd02b966"
meta-freescale       = "HEAD:407c6cf408969445031a492e2d25e0e2749582ea"
meta-freescale-3rdparty = "HEAD:88a29631809d1af0df618245430db29f2a7012b5"
meta-freescale-distro = "HEAD:f7e2216e93aff14ac32728a13637a48df436b7f4"
meta-bsp             
meta-sdk             = "HEAD:9867dae67c158e0820bf226bd18b792623e99b25"
meta-browser         = "HEAD:75640e14e325479c076b6272b646be7a239c18aa"
meta-gnome           
meta-networking      
meta-python          
meta-filesystems     = "HEAD:2bb21ef27c4b0c9d52d30b3b2c5a0160fd02b966"
meta-qt5             = "HEAD:d4e7f73d04e8448d326b6f89908701e304e37d65"

```

## Restart a build environment
```bash
$ source setup-environment <build-dir>
```

## Flash

Using [mfgtools](https://github.com/NXPmicro/mfgtools) provided by nxp to flash.

Flash to emmc:

```bash
sudo uuu -b emmc_all imx-boot-imx8mmevk-sd.bin-flash_evk fsl-image-validation-imx-imx8mmevk.sdcard.bz2/*
```

In develop stage, suggest to use TFTP and NFS for a longer flash life span. See [i.MX setup TFTP and NFS](https://lzqblog.top/2019-05-26/i-MX-setup-TFTP-and-NFS/) for more details.
