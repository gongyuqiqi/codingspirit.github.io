---
title: 'Yocto: Configure kernel with config fragments'
top: false
tags:
  - Linux
  - Yocto
date: 2019-08-24 18:09:44
categories: 随便写写
---

From my point of view it will be better to use config fragments to configure kernel instead of directly modifying *.config* file, the former way will be much easier to disable changes when you want to roll back.

<!--more-->

## Using menuconfig to get the new .config file you want

Taking raspberrypi as an example. Replace *linux-raspberrypi* to your kernel recipe name. i.e. change it to linux-imx if you are using NXP i.MX SoC. Same modification need to be applied for following steps.

```bash
bitbake linux-raspberrypi -c menuconfig
```

## Get differences

```bash
bitbake linux-raspberrypi -c diffconfig
```

Save the generated *.cfg* fragments file. We gonna use it in next step.

If you can make sure about which *CONFIG_XXXX* need to be changed, you can write fragments file by yourself as well.

## Using bbappend to apply fragments

Yocto provides bbappend for developers to modify constructing steps without modifying the original recipes, and that's how we apply fragments.

Assuming that you already have a yocto layer works properly, then create recipes with this structure:

```bash
recipes-kernel/
└── linux
    ├── linux-raspberrypi
    │   └── enable_adb-cp.cfg
    └── linux-raspberrypi_%.bbappend

```

Name of bbappend file should be same as your kernel recipe, here we use wildcard *%* to make sure bbappend can be applied to any version of linux-raspberrypi recipes.

```bbappend

FILESEXTRAPATHS_prepend:="${THISDIR}/${PN}:"

# Enable adb
SRC_URI_append += "file://enable_adb-cp.cfg"

do_configure_append() {
    ${S}/scripts/kconfig/merge_config.sh -m -O ${B} ${B}/.config ${WORKDIR}/*-cp.cfg
}

```
As you can see the path we put **\*.cfg** files will not be include by default, so using **FILESEXTRAPATHS_prepend** to specify searching path is required. Then we will add step when do_configure, which will call **merge_config.sh** tool provided by kernel source to automatically merge fragments into kernel config file.

The funny part is I found that I made a mistake when I trying to enable usb adbd on raspberry pi 3: raspberry pi 3 can't be used as gadget mode because of hardware limitations. But at least I verified the way to apply fragments works.-_-.
